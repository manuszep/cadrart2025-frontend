# Component Examples with Data Test IDs

This document shows how to add `data-testid` attributes to your components to make them testable with E2E tests.

## Login Component Example

Here's how you could modify your login component to be E2E testable:

```html
<!-- src/routes/login/login.component.html -->
<div class="cadrart-login">
  <cadrart-card [title]="'LOGIN.TITLE'" [image]="image()">
    <form class="cadrart-login__form" [esfsFormGroup]="loginForm" data-testid="login-form">
      <esfs-field 
        name="mail" 
        (esfsBlur)="handleMailBlur()"
        data-testid="email-input">
      </esfs-field>
      <esfs-field 
        name="password"
        data-testid="password-input">
      </esfs-field>
      <cadrart-button 
        type="submit" 
        (cadrartClick)="handleSubmit()"
        data-testid="login-button">
        {{ 'LOGIN.SUBMIT' | translate }}
      </cadrart-button>
    </form>

    @if (error()) {
      <div class="cadrart-login__error" data-testid="error-message">
        {{ error() ?? '' | translate }}
      </div>
    }
  </cadrart-card>
</div>
```

## Offer List Component Example

```html
<!-- src/routes/offer/list/offer-list.component.html -->
<div class="cadrart-offer-list">
  <div class="cadrart-offer-list__header">
    <input 
      type="text" 
      placeholder="Search offers..."
      data-testid="search-input"
      (input)="handleSearch($event)">
    
    <select 
      data-testid="filter-dropdown"
      (change)="handleFilter($event)">
      <option value="">All Status</option>
      <option value="draft">Draft</option>
      <option value="sent">Sent</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>

    <cadrart-button 
      data-testid="create-offer-button"
      (cadrartClick)="createOffer()">
      Create Offer
    </cadrart-button>
  </div>

  <div class="cadrart-offer-list__content" data-testid="offer-list">
    @for (offer of offers(); track offer.id) {
      <div 
        class="cadrart-offer-item" 
        data-testid="offer-item"
        (click)="selectOffer(offer)">
        <h3>{{ offer.clientName }}</h3>
        <p>{{ offer.description }}</p>
        <span>{{ offer.price | currency }}</span>
      </div>
    }
  </div>
</div>
```

## Task Management Component Example

```html
<!-- src/routes/tasks/tasks.component.html -->
<div class="cadrart-tasks">
  <div class="cadrart-tasks__filters">
    <input 
      type="text" 
      placeholder="Search tasks..."
      data-testid="search-tasks-input"
      (input)="handleSearch($event)">
    
    <select 
      data-testid="task-status-filter"
      (change)="handleStatusFilter($event)">
      <option value="">All Status</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>

    <select 
      data-testid="task-type-filter"
      (change)="handleTypeFilter($event)">
      <option value="">All Types</option>
      <option value="glass">Glass</option>
      <option value="wood">Wood</option>
      <option value="assembly">Assembly</option>
      <option value="cardboard">Cardboard</option>
      <option value="pass">Pass</option>
    </select>

    <cadrart-button 
      data-testid="create-task-button"
      (cadrartClick)="createTask()">
      Create Task
    </cadrart-button>
  </div>

  <div class="cadrart-tasks__list" data-testid="task-list">
    @for (task of tasks(); track task.id) {
      <div 
        class="cadrart-task-item" 
        data-testid="task-item"
        (click)="selectTask(task)">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <span class="task-type">{{ task.type }}</span>
        <span class="task-status">{{ task.status }}</span>
      </div>
    }
  </div>
</div>
```

## Settings Component Example

```html
<!-- src/routes/settings/settings.component.html -->
<div class="cadrart-settings">
  <nav class="cadrart-settings__nav" data-testid="settings-menu">
    <a 
      routerLink="/settings/team-member" 
      data-testid="team-member-section">
      Team Members
    </a>
    <a 
      routerLink="/settings/tag" 
      data-testid="tag-section">
      Tags
    </a>
    <a 
      routerLink="/settings/provider" 
      data-testid="provider-section">
      Providers
    </a>
    <a 
      routerLink="/settings/location" 
      data-testid="location-section">
      Locations
    </a>
    <a 
      routerLink="/settings/client" 
      data-testid="client-section">
      Clients
    </a>
    <a 
      routerLink="/settings/formula" 
      data-testid="formula-section">
      Formulas
    </a>
    <a 
      routerLink="/settings/article" 
      data-testid="article-section">
      Articles
    </a>
  </nav>

  <div class="cadrart-settings__content">
    <router-outlet></router-outlet>
  </div>
</div>
```

## Best Practices for Data Test IDs

1. **Use descriptive names**: `data-testid="create-offer-button"` instead of `data-testid="btn1"`

2. **Be consistent**: Use kebab-case for all test IDs

3. **Group related elements**: Use prefixes like `offer-`, `task-`, `login-`

4. **Avoid implementation details**: Don't use CSS class names or IDs that might change

5. **Keep them simple**: Test IDs should be easy to understand and maintain

6. **Use them sparingly**: Only add test IDs to elements that are important for testing

## Testing with Data Test IDs

Once you've added the test IDs, your E2E tests can easily find and interact with elements:

```typescript
// In your page object
private readonly emailInput = '[data-testid="email-input"]';
private readonly passwordInput = '[data-testid="password-input"]';
private readonly loginButton = '[data-testid="login-button"]';

async login(email: string, password: string): Promise<void> {
  await this.fillInput(this.emailInput, email);
  await this.fillInput(this.passwordInput, password);
  await this.clickElement(this.loginButton);
}
```

This approach makes your tests more maintainable and less brittle than using CSS selectors or XPath expressions. 
