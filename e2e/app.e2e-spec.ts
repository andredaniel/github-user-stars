import { GithubUserStarsPage } from './app.po';

describe('github-user-stars App', () => {
  let page: GithubUserStarsPage;

  beforeEach(() => {
    page = new GithubUserStarsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
