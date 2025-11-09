Feature: E-commerce Checkout Flow
  As a customer
  I want to complete a purchase on the demo e-commerce site
  So that I can buy products online

  Scenario: Complete Happy Path Checkout Flow
    Given I am on the DemoBlaze home page
    When I log in with valid credentials
    Then I should be successfully authenticated
    When I navigate to and select "Samsung galaxy s6"
    Then the product details should be displayed
    When I add the product to cart
    Then a success message should appear
    Then the cart items should be verified
    When I complete the checkout form with valid details
    When I submit the order
    Then the order should be placed successfully
    And I should see the "Thank you for your purchase!" modal

