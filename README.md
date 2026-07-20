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


## Database Architecture & Schema

The database (PostgreSQL) is structured to manage relationships between perfume brands, olfactory pyramids, accord intensities, and a comprehensive raw material glossary (*ingredients*).

###  Entity-Relationship Overview


```

[Brands] 1 ──── N [Perfumes] 1 ──── N [Perfume Accords]
│
└──── N [Perfume Notes] N ──── 1 [Ingredients]

```

---

###  Database Tables

#### 1. `brands`
Stores information about fragrance houses.
* **`id`** (`INTEGER`, PK, Auto-increment): Unique brand identifier.
* **`name`** (`VARCHAR(255)`): Brand name (e.g., *Afnan*, *Chanel*).

#### 2. `perfumes`
The core entity representing individual fragrances.
* **`id`** (`INTEGER`, PK, Auto-increment): Unique perfume identifier.
* **`brand_id`** (`INTEGER`, FK $\rightarrow$ `brands.id`): Associated brand.
* **`title`** (`VARCHAR(255)`): Perfume title/name.
* **`description`** (`TEXT`): Detailed fragrance description.
* **`release_year`** (`INTEGER`): Launch year.
* **`perfumer`** (`VARCHAR(255)`): Master perfumer(s) / Nose behind the fragrance.
* **`created_at`** (`TIMESTAMP`): Record creation timestamp.

#### 3. `perfume_accords`
Defines the main dominant olfactory accords and their visual intensity.
* **`id`** (`INTEGER`, PK, Auto-increment): Unique accord record identifier.
* **`perfume_id`** (`INTEGER`, FK $\rightarrow$ `perfumes.id`): Associated perfume.
* **`accord_name`** (`VARCHAR(100)`): Accord category (e.g., *citrus*, *woody*, *sweet*).
* **`intensity_percentage`** (`NUMERIC(5,2)`): Relative dominance percentage.

#### 4. `perfume_notes` (Junction Table / Olfactory Pyramid)
Establishes the many-to-many relationship between fragrances and raw ingredients.
* **`perfume_id`** (`INTEGER`, FK $\rightarrow$ `perfumes.id`): Associated perfume.
* **`ingredient_id`** (`INTEGER`, FK $\rightarrow$ `ingredients.id`): Associated ingredient.
* **`layer`** (`VARCHAR(50)`): Position within the pyramid (`top`, `heart`, `base`).

#### 5. `ingredients` (Raw Material Glossary)
Detailed technical and sensory profiles for raw materials.
* **`id`** (`BIGINT`, PK, Auto-increment): Unique ingredient identifier.
* **`name`** (`VARCHAR(255)`): Common name (e.g., *Bergamot*).
* **`botanical_name`** (`VARCHAR(255)`): Scientific / Botanical classification.
* **`category`** / **`subcategory`** (`VARCHAR(255)`): Classification taxonomy.
* **`olfactory_family`** (`VARCHAR(255)`): Main scent family.
* **`typical_volatility`** (`VARCHAR(255)`): Evaporation rate (Top, Heart, or Base note).
* **`odor_strength`** (`VARCHAR(255)`): Sensory intensity rating.
* **`evolution_immediate`** / **`evolution_after_hours`** / **`evolution_after_days`**: Sensory evolution over time.
* **`short_description`** / **`description`** / **`appearance`** / **`producing_countries`**: Visual characteristics, origins, and descriptive notes.
