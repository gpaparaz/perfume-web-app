# Perfume Web App - Data Analytics & Community Archivist

A full-stack application designed for advanced filtering, exploration, and data analysis of the perfumery world. This project combines algorithmic web scraping with public datasets to map the relationships between brands, olfactory notes, and accord intensities.

---

## Project Architecture

The project is structured as a decoupled application with two independent main modules:

```text
📂 perfume-web-app
 ┣ 📂 backend  --> REST API Server built with Java 21 + Spring Boot + JPA
 ┗ 📂 client   --> User Interface (UI) built with React + Vite + TypeScript

```

### The Backend (Java + Spring Boot)

The business logic, entity relationships, and REST APIs are handled by a backend built on Java 21 leveraging the Spring Boot ecosystem.

* **Persistence:** Managed via Spring Data JPA and Hibernate for automatic mapping of object-oriented models to the relational database.
* **Database:** PostgreSQL, optimized for complex queries and structured JOIN operations between perfumes, accords, and olfactory pyramids.

### The Client (React + Vite + TypeScript)

The graphical interface is a modern, responsive, and strongly typed Single Page Application (SPA).

* The build infrastructure is powered by Vite to guarantee fast hot-reloading during development.
* Communication with the backend is performed through asynchronous HTTP requests handled via Axios.

---

## Data Sources & Datasets

The application's knowledge base normalizes and merges three distinct data sources, combining static open-source data with custom web scraping operations:

### 1. Première Peau (Glossary & Raw Materials)

* **Data:** Technical raw materials information, olfactory families, and terminology definitions.
* **Method:** Data extracted using a custom scraper developed in Node.js (with Puppeteer) targeting the public resources of Première Peau.

### 2. Fragrantica.com (Extended Catalog)

* **Data:** A massive volume of perfumes, complete olfactory pyramids, user reviews, and main accord weights.
* **Method:** Integration of the historical public dataset available on Kaggle:
https://www.kaggle.com/datasets/olgagmiufana1/fragrantica-com-fragrance-dataset

### 3. Parfumo.net (Perfumes & Brand Core)

* **Data:** Detailed information on seasonal releases, niche/independent brands, and structured notes.
* **Method:** Integration of community-curated data made available through the TidyTuesday project:
https://github.com/rfordatascience/tidytuesday/blob/main/data/2024/2024-12-10/readme.md

---

## System Requirements

To run the full stack environment locally, the following prerequisites are required:

* Java SDK 21 or higher
* Node.js (v20+ recommended for the client module)
* Active PostgreSQL Server instance


> This project is developed for educational purposes to study modern enterprise architecture with Java while addressing data normalization challenges from heterogeneous sources.
