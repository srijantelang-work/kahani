-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_theme as enum ('light', 'dark', 'system');
create type content_type as enum ('article', 'video', 'book', 'podcast');
create type list_type as enum ('watchlist', 'readinglist');

-- Profiles table (extends Supabase auth.users)
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    bio text,
    theme user_theme default 'system',
    email_notifications boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_sync_at timestamptz default now(),
    constraint username_length check (char_length(username) >= 3)
);

-- User preferences table
create table user_preferences (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id) on delete cascade,
    language text default 'en',
    content_filters jsonb default '{}',
    accessibility_settings jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id)
);

-- Lists table (for both watchlists and reading lists)
create table lists (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id) on delete cascade,
    name text not null,
    description text,
    type list_type not null,
    is_public boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_sync_at timestamptz default now(),
    sync_version bigint default 1,
    constraint name_length check (char_length(name) >= 1)
);

-- Content items table
create table content_items (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    url text,
    thumbnail_url text,
    type content_type not null,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- List items table (junction table between lists and content_items)
create table list_items (
    id uuid primary key default uuid_generate_v4(),
    list_id uuid references lists(id) on delete cascade,
    content_id uuid references content_items(id) on delete cascade,
    position integer not null,
    notes text,
    is_completed boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_sync_at timestamptz default now(),
    sync_version bigint default 1,
    unique(list_id, content_id)
);

-- User interaction history
create table interaction_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id) on delete cascade,
    content_id uuid references content_items(id) on delete cascade,
    interaction_type text not null,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    client_timestamp timestamptz not null,
    sync_status text default 'pending'
);

-- Sync log for offline support
create table sync_log (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id) on delete cascade,
    entity_type text not null,
    entity_id uuid not null,
    operation text not null,
    payload jsonb not null,
    status text default 'pending',
    created_at timestamptz default now(),
    processed_at timestamptz
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table user_preferences enable row level security;
alter table lists enable row level security;
alter table content_items enable row level security;
alter table list_items enable row level security;
alter table interaction_history enable row level security;
alter table sync_log enable row level security;

-- Create policies
-- Profiles policies
create policy "Users can view their own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- Lists policies
create policy "Users can view their own lists"
    on lists for select
    using (auth.uid() = user_id);

create policy "Users can view public lists"
    on lists for select
    using (is_public = true);

create policy "Users can create lists"
    on lists for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own lists"
    on lists for update
    using (auth.uid() = user_id);

create policy "Users can delete their own lists"
    on lists for delete
    using (auth.uid() = user_id);

-- List items policies
create policy "Users can view items in their lists"
    on list_items for select
    using (
        exists (
            select 1 from lists
            where lists.id = list_items.list_id
            and (lists.user_id = auth.uid() or lists.is_public = true)
        )
    );

create policy "Users can modify items in their lists"
    on list_items for all
    using (
        exists (
            select 1 from lists
            where lists.id = list_items.list_id
            and lists.user_id = auth.uid()
        )
    );

-- User preferences policies
create policy "Users can view their own preferences"
    on user_preferences for select
    using (auth.uid() = user_id);

create policy "Users can update their own preferences"
    on user_preferences for update
    using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
    on user_preferences for insert
    with check (auth.uid() = user_id);

-- Content items policies
create policy "Users can view content items in their lists"
    on content_items for select
    using (
        exists (
            select 1 from list_items li
            join lists l on l.id = li.list_id
            where li.content_id = content_items.id
            and (l.user_id = auth.uid() or l.is_public = true)
        )
    );

create policy "Users can create content items"
    on content_items for insert
    with check (true);  -- Allow creation as items are secured through list access

-- Interaction history policies
create policy "Users can view their own interactions"
    on interaction_history for select
    using (auth.uid() = user_id);

create policy "Users can create their own interactions"
    on interaction_history for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own interactions"
    on interaction_history for update
    using (auth.uid() = user_id);

-- Sync log policies
create policy "Users can view their own sync logs"
    on sync_log for select
    using (auth.uid() = user_id);

create policy "Users can create their own sync logs"
    on sync_log for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own sync logs"
    on sync_log for update
    using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_profiles_username on profiles(username);
create index idx_lists_user_id on lists(user_id);
create index idx_list_items_list_id on list_items(list_id);
create index idx_list_items_content_id on list_items(content_id);
create index idx_interaction_history_user_id on interaction_history(user_id);
create index idx_sync_log_user_id on sync_log(user_id);
create index idx_sync_log_status on sync_log(status);

-- Create functions for sync version management
create or replace function increment_sync_version()
returns trigger as $$
begin
    new.sync_version := old.sync_version + 1;
    new.last_sync_at := now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for sync version management
create trigger update_list_sync_version
    before update on lists
    for each row
    execute function increment_sync_version();

create trigger update_list_item_sync_version
    before update on list_items
    for each row
    execute function increment_sync_version(); 