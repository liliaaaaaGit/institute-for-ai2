@@ .. @@
 /*
 # Initial CO₂ Calculator Schema
+
+This migration enables the pgcrypto extension and creates the core schema
+for the CO₂ calculator application.
 
 1. New Tables
   - `models` - AI model definitions with emission factors
@@ .. @@
   - Add real-world comparison factors
 */
 
+-- Enable required extensions
+CREATE EXTENSION IF NOT EXISTS pgcrypto;
+
 -- Create tables