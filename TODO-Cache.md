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
  - Assess performance
- Implement basic caching on the interceptor side.
  - Clear the whole cache on each websocket events
- Enforce subscription / unsubscription on any cached data request. Try to automatize as much as possible so errors are reduced
- Once done, detect active subscriptions to force a refresh of these subscriptions (if related to the modified endpoint).
- I think we can suppose that if an entity changes, it's most probably related in a way to the current view. So we can update the data requests for all active subscription

