**Shopify Frontend Developer Coding Challenge**

**Project Overview**

This project was developed as part of a coding challenge to showcase the ability to build a custom Shopify storefront using Shopify Liquid code. The challenge required creating a responsive, accessible homepage template that displays content fetched from Shopify, including a featured product section with a subscription offering simulation. The task emphasized performance, accessibility, and custom styling.

**Features**

1. Homepage Template
A custom homepage built using Liquid code, as per the design wireframe.
Mobile-first design that is fully responsive.


2. Page Content Display
Dynamically pulls the page title and description using a custom section.
Displays the title Marine Liquid Collagen Drink for Women and description text from the Shopify Admin.


3. Key Benefits Section
Custom section allowing the admin to input a title and up to three key benefits.
Key benefits displayed on the homepage:
Clinically Proven
100% Saw Improvement
8000mg of Collagen


4. Why Subscribe Section
A custom section displaying reasons to subscribe with a title and up to three reasons.
Reasons displayed under the title Why Subscribe?.


5. Product Subscription Simulation
Featured product section for the hero product, Marine Liquid Collagen Drink for Women.
Subscription options provided using product variants:
One-Time Purchase: £33.99
14-Day Subscription: £27.00
28-Day Subscription: £55.98
The first "Subscribe" button scrolls to the product details section, and the final "Subscribe" button adds the selected product variant to the cart.
A popup cart allows the user to review and checkout from the homepage.


6. Additional Functionality
Popup Cart: A cart popup appears when a product is added, allowing immediate checkout.
Lazy Loading: Implemented for images to enhance page performance.
Unit Testing: Basic unit tests for the sections using Jest.
Error Handling: Graceful error handling in case the product is unavailable.
Accessibility: Designed according to WCAG 2.1 accessibility standards.
Technologies Used
Shopify Liquid: Core technology used for building the Shopify theme and rendering dynamic content.
HTML/CSS/JavaScript: For structuring, styling, and adding interactivity to the website.
Jest: Unit testing framework for frontend components.
Google Fonts: Used as a close match for the IvyMode (Headings) and Proxima Nova (Body text) fonts specified in the task.
Installation & Setup


**1. Clone the Repository**

To get started, clone the project repository using the following command:

git clone https://github.com/HassanRazaGit/shopify-frontend-developer-challenge.git

cd shopify-frontend-developer-challenge


**2. Upload to Shopify**

Go to your Shopify Admin dashboard.

Navigate to Online Store > Themes.

Click Actions > Upload Theme, and select the theme files from your local machine.

Customize the theme in the Shopify theme editor by selecting appropriate sections for content and products.


**3. Customize the Theme**

Page Content Section: In the theme customizer, select the page to pull content from (page title and description).
Key Benefits Section: Enter the section title and up to three key benefits.
Why Subscribe Section: Enter the title and reasons to subscribe.
Featured Product Section: Select the hero product.

**Performance & Optimization**

Lazy Loading: Images are lazily loaded to improve page load speed and reduce unnecessary resource usage.
Error Handling: The app gracefully handles scenarios like product unavailability, ensuring a smooth user experience.

**Accessibility**

This project follows WCAG 2.1 guidelines for web accessibility, ensuring that users with disabilities can easily interact with the site. Features include:

Proper use of semantic HTML elements.
Text alternatives for non-text content.
Keyboard navigation compatibility.


**Bonus Features**

**Unit Testing:** Unit tests for key components using Jest.

**Lazy Loading:** Optimized image loading for improved performance.

**Error Handling:** Custom error messages for product-related issues.

**Custom Styling:** Additional CSS for a unique, clean design.

**Accessibility:** Ensured the theme follows best practices for web accessibility (WCAG 2.1).

