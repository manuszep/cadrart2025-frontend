# Backend cache system

## Current situation

- Since last changes, cache does not seem to be reliable anymore. Especially cache refreshes.
- Having to speecify the list of endpoints is tedious.
- Sockets updates should be detected by the cache itself and handled there to force-refresh active subscriptions.

## Target

- Making a requests returns an observable that is stored in the corresponding cache key as it's the case currently.
- Enforce unsubscription when data observable are no longer needed.
- Implement webSocket events subscriptions in cache
- Handle these events in the cache:
  - Detect current active data subscriptions.
  - For each active data subscription, trigger a new request.
    - Note: Anything can be a key. A method can be a key. So the method used to trigger the request could be used to reference the results.
    - Issue with this approach is that there's no way to know what entity name is related.
    - The request method could be stored alongside results.
- As currently, adding, deleting or updating an entity causes the update of the list request, entity details request and 
  - A standard set of paths should be provided. Ex: if offer 25 is modified, GET /offers and GET /offer/25 should be cleared
  - Each service can (but do not have to) provide an extension to that list of paths

## Plan

- Remove caching in a first step.
  - Modify CadrartCacheService.makeRequest to always make HTTP calls
  - Assess performance
- Implement basic caching on the interceptor side. Create new HttpCacheInterceptor
  - Cache GET requests only
  - Clear the whole cache on each websocket events
  - Simple in-memory storage
- Enhance CadrartCacheService with:
  - Active subscription tracking
  - Automatic cleanup on component destruction
  - Subscription lifecycle management
- Implement automatic cache invalidation:
  - Entity-based invalidation patterns
  - Active subscription refresh
  - Standard endpoint mapping
- I think we can suppose that if an entity changes, it's most probably related in a way to the current view. So we can update the data requests for all active subscription

