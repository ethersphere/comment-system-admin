import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Feed } from "../model/feed.model";

export interface FeedsData {
  feeds: Feed[];
  addFeed: () => void;
  removeFeed: (feedHash: string) => void;
  updateFeed: (feed: Feed) => void;
}

const FEEDS_STORAGE_KEY = "swarm-comment-system-feeds";

export function isFeed(data: unknown): data is Feed {
  const { id, date } = (data || {}) as Feed;

  return typeof id === "string" && typeof date === "number";
}

export function isFeedArray(data: unknown): data is Feed[] {
  const feeds = (data || []) as Feed[];

  return Array.isArray(feeds) && feeds.every((feed) => isFeed(feed));
}

function getFeedsFromStorage(): Feed[] {
  try {
    const feeds = JSON.parse(localStorage.getItem(FEEDS_STORAGE_KEY) || "[]");

    if (isFeedArray(feeds)) {
      return feeds;
    }
  } catch (error) {
    console.error(error);
  }

  return [];
}

function saveFeedsToStorage(feeds: Feed[]) {
  localStorage.setItem(FEEDS_STORAGE_KEY, JSON.stringify(feeds));
}

export function useFeeds(): FeedsData {
  const [feeds, setFeeds] = useState<Feed[]>(getFeedsFromStorage());

  const addFeed = () => {
    const feed: Feed = {
      id: uuid(),
      date: new Date().getTime(),
    };
    const updatedFeeds = [...feeds, feed];
    setFeeds(updatedFeeds);
    saveFeedsToStorage(updatedFeeds);
  };

  const removeFeed = (feedId: string) => {
    const index = feeds.findIndex((feed) => feedId === feed.id);

    if (index < 0) {
      return;
    }

    const updatedFeeds = [...feeds];
    updatedFeeds.splice(index, 1);
    setFeeds(updatedFeeds);
    saveFeedsToStorage(updatedFeeds);
  };

  const updateFeed = (feed: Feed) => {
    const index = feeds.findIndex(({ id }) => id === feed.id);

    if (index < 0) {
      return;
    }

    const updatedFeeds = [...feeds];
    updatedFeeds[index] = feed;
    setFeeds(updatedFeeds);
    saveFeedsToStorage(updatedFeeds);
  };

  return { feeds, addFeed, removeFeed, updateFeed };
}
