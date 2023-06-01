### Conceptual Exercise

Answer the following questions below:

- What is a JWT?
  - JWT stands for JSON Web Token, which is a "method for representing claims securely between two parties".  It is commonly used for authentication and authorization purposes in web applications. JWTs are a string consisting of three parts: header, payload, and signature. 

- What is the signature portion of the JWT?  What does it do?
  -The signature portion of the JWT is a version of the encoded header and encoded payload that is signed with a secret key. It is used to validate the authenticity of the token by allowing the recipient to verify that the token hasn't been tampered with.

- If a JWT is intercepted, can the attacker see what's inside the payload?
  -Attackers can see what's in the payload because it is base64-encoded, not encrypted. However, if they modify the payload it will invalidate the signature, which will alert the recipient that the token is invalid. 

- How can you implement authentication with a JWT?  Describe how it works at a high level.
  -To implement authentication with a JWT, you set up the following: The client will send login credentials to the server, which will verify the credentials and generates a JWT containing relevant information about the authenticated user. The server sends the JWT back to the client. The client stores the JWT (e.g., in local storage or a cookie) and includes it in subsequent requests to the server.
  The server verifies the authenticity of the JWT on each request by checking the signature and validating the claims.
  If the JWT is valid, the server processes the request and responds accordingly. If it's invalid, an authentication error is returned.

- Compare and contrast unit, integration and end-to-end tests.
  -Unit tests are focused on testing small, isolated units of code, such as functions or methods. Integration tests involve testing the interaction between multiple components or modules to ensure they work together correctly. End-to-end tests simulate real user scenarios and test the entire system from start to finish. They cover multiple components and verify that the system functions correctly as a whole.

- What is a mock? What are some things you would mock?
  - A mock is an object that simulates the behavior of a real object or component to recreate certain conditions or responses during testing, primarily unit testing. This is useful if the real objects are impractical to incorporate into the unit test. You can mock AJAX requests, reading/writing to files, databases, and impure functions.

- What is continuous integration?
  -Continuous Integration is the practice of frequently merging small code changes to a shared repository, rather than merging in a large change at the end of a development cycle. It can automate running your tests when pushing your code, reject deployments if your tests do not pass, and easily notify you when changes to your test suite occur.

- What is an environment variable and what are they used for?
  -An environment variable is a value that is set outside of the application and is accessible to the application during runtime. It provides a way to configure and customize the behavior of an application based on the environment it's running in (e.g., development, staging, production). Environment variables are often used to store sensitive information like API keys, database credentials, or configuration settings.

- What is TDD? What are some benefits and drawbacks?
  -TDD (Test-Driven Development) is a software development approach where tests are written before the code. Benefits of TDD include improved code quality, faster feedback on defects, increased confidence in the codebase, and better maintainability. Drawbacks of TDD include the initial investment of time in writing tests upfront and the potential for over-testing or writing unnecessary tests. 

- What is the value of using JSONSchema for validation?
  -JSONSchema enables you to define and enforce the expected structure and data types for JSON payloads. It helps ensure that the incoming data conforms to the specified schema, reducing the chances of data inconsistencies or errors. It is easy to set up and maintain, and it allows user data to fail before bad data gets to the database, and it reduces the amount of code for processing and validating data.

- What are some ways to decide which code to test?
  - It's a good idea to test code that relates to the following: Critical user flows, to ensure reliability and correctness.
  Complex logic code sections with intricate branching or calculations. Input validation such as user inputs and data validation. Error handling. Boundary conditions like edge cases, boundary conditions, and exceptional scenarios. 

- What does `RETURNING` do in SQL? When would you use it?
  - RETURNING is used in an INSERT, UPDATE, or DELETE statement to return the values of the affected rows after the operation is performed. You can retrieve specific columns or all columns from the affected rows. The RETURNING clause can be useful in scenarios where you need to access the values of the modified rows immediately after the operation. 

- What are some differences between Web Sockets and HTTP?
  -HTTP follows a request-response model, where a client initiates a request, and the server responds. Each request establishes a new connection, and the connection is closed after the response is received. Web Sockets, on the other hand, provide a persistent, bidirectional communication channel between the client and the server, allowing real-time data exchange. HTTP is primarily designed for request-response communication, and the server cannot send data to the client unless requested. Web Sockets enable both the server and client to send data to each other at any time without waiting for a request.


- Did you prefer using Flask over Express? Why or why not (there is no right
  answer here --- we want to see how you think about technology)?
  - Thus far I have preferred using Flask over Express. I found Flask to be simpler to grasp, with a more intuitive set up (both the initial installations down to the routes). I think that in Express, the way the routes were set up with functions that had req/res/next arguments required extra abstract understanding that I didn't fully grasp and just had to memorize the way it worked. Authentication and error handling with Flask was also simpler and didn't require middleware. I did like how Express seemed more modular and organized overall, though. 

