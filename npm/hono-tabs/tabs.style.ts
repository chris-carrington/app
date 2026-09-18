// app/npm/hono-tabs/tabs.style.ts

import { css } from 'hono/css'


export const tabsStyle = css`
  .tabs--pill,
  .tabs--classic {
    .tabs__marker {
      position: absolute;
      z-index: calc(var(--z-content) - 1);
      top: 0;
      left: 0;
      background: var(--tabs-background);
      transition: var(--transition);
      will-change: transform, width, height, opacity;
      pointer-events: none;
    }

    .tabs__active,
    .tabs__tab:hover {
      color: var(--tabs-foreground);
    }
  }

  .tabs--classic {
    .tabs__marker {
      border-top-left-radius: calc(var(--radius) * 2);
      border-top-right-radius: calc(var(--radius) * 2);
    }
  }

  .tabs--underline {
    .tabs__marker {
      position: absolute;
      z-index: var(--z-content);
      bottom: 0;
      border-radius: calc(var(--radius) * 6);
      height: 0.3rem;
      background: var(--tabs-background);
      transition: transform var(--prop-transition), width var(--prop-transition);
      will-change: transform, width;
    }

    .tabs__active,
    .tabs__tab:hover {
      color: var(--tabs-foreground);
    }
  }

  .tabs--pill .tabs__marker {
    border-radius: calc(var(--radius) * 9);
  }

  .tabs__inner {
    position: relative;
    z-index: var(--z-content);
    display: flex;
    gap: var(--space);
    overflow-x: auto;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tabs__tab {
    position: relative;
    z-index: var(--z-content);
    padding: var(--space-lite);
    white-space: nowrap;
    cursor: pointer;
    transition: var(--transition);
    color: var(--muted-foreground);
  }

  .tabs__contents {
    margin-block: var(--space);
  }

  .tabs__content {
    display: none;
    &.tabs__active {
      display: block;
    }
  }
` 
