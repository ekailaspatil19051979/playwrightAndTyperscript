export class HomePage {
    private searchInput = 'input[title="Search for products, brands and more"]';
    private searchButton = 'button[type="submit"]';
    private loginButton = 'a._1_3w1N';

    async navigateToHomePage(page) {
        await page.goto('https://www.flipkart.com/');
    }

    async enterSearchTerm(page, searchTerm) {
        await page.fill(this.searchInput, searchTerm);
    }

    async clickSearchButton(page) {
        await page.click(this.searchButton);
    }

    async clickLoginButton(page) {
        await page.click(this.loginButton);
    }
}