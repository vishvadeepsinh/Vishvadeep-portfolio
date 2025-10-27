# Design Projects Import Plan

## Overview
This document outlines the comprehensive plan for extracting design project data from CSV records and systematically importing it into the database.

---

## 1. Data Source Analysis

### CSV Structure
The provided CSV contains the following fields:
- **Sr No.**: Sequential project number
- **Project name**: Full project title/description
- **Date**: Project completion/submission date (DD/MM/YYYY format)
- **Design link**: Canva design URL
- **Content Link**: Google Docs content URL
- **Drive Design link**: Google Drive folder URL
- **HOURS**: Time spent on project
- **Revision Required**: Revision status
- **Revisions design**: Design revision notes
- **Revision content**: Content revision notes
- **Client feedback**: Feedback received
- **Status**: Project status (Completed, In Progress, etc.)

### Data Quality Considerations
- Some fields may be empty or contain placeholder values
- Project names may be very long and need truncation
- Dates need format conversion (DD/MM/YYYY → ISO 8601)
- URLs need validation
- Status values need standardization

---

## 2. Database Schema Mapping

### Target Table: `projects`

| CSV Field | Database Column | Transformation | Validation |
|-----------|----------------|----------------|------------|
| Project name | `title` | Clean, truncate to 100 chars | Required, non-empty |
| Multiple fields | `description` | Combine project details | Generated from multiple fields |
| Project name | `technologies` | Extract design tools | Array of strings |
| N/A | `github_url` | Set to NULL | Design projects don't have repos |
| Design link | `live_url` | Direct mapping | URL validation |
| N/A | `image_url` | Set to NULL initially | To be added manually later |
| Status | `featured` | Map "Completed" → true | Boolean |
| Sr No. | `order_index` | Direct mapping | Integer |
| Date | `created_at` | Convert to ISO 8601 | Valid date format |

### Field Mapping Details

#### Title Generation
\`\`\`
Source: "Project name" field
Process: 
  1. Trim whitespace
  2. Truncate to 100 characters if longer
  3. Add ellipsis (...) if truncated
Example: "SparePartsHolland - EBC - Hydraulic..." → "SparePartsHolland - EBC - Hydraulic Top Link Cat. 1-1 with Locking Block 20 7/8..."
\`\`\`

#### Description Generation
\`\`\`
Combine multiple fields:
  - Project name
  - Time spent (HOURS)
  - Status
  - Revision information
Format: "Design project: [name] | Time spent: [hours] | Status: [status] | Revisions: [info]"
\`\`\`

#### Technologies Extraction
\`\`\`
Extract from project name:
  - Look for: Canva, Figma, Photoshop, Illustrator, InDesign
  - Default to: ["Canva"] if no specific tool found
  - Store as: PostgreSQL ARRAY
\`\`\`

#### Date Conversion
\`\`\`
Input: "24/04/2025" (DD/MM/YYYY)
Output: "2025-04-24T00:00:00Z" (ISO 8601)
Fallback: Current date if parsing fails
\`\`\`

---

## 3. Data Import Methods

### Method 1: Automated Script (Recommended)
**Pros:**
- Fast bulk import
- Consistent data transformation
- Repeatable process
- Built-in validation

**Cons:**
- Requires technical setup
- Less control over individual entries

**Implementation:**
\`\`\`typescript
// Use the provided import-design-projects.ts script
import { importDesignProjects } from './scripts/import-design-projects'

const csvUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/...'
const projects = await importDesignProjects(csvUrl)

// Review projects before inserting
console.log(projects)

// Insert into database
// (Use Supabase client or SQL script)
\`\`\`

### Method 2: SQL Script Generation
**Pros:**
- Direct database insertion
- Can review SQL before execution
- Easy rollback

**Cons:**
- Manual script generation
- Requires SQL knowledge

**Implementation:**
\`\`\`sql
-- Generated SQL script with INSERT statements
INSERT INTO projects (title, description, technologies, live_url, featured, order_index, created_at)
VALUES 
  ('Project 1', 'Description...', ARRAY['Canva'], 'https://...', true, 1, '2025-04-24T00:00:00Z'),
  ('Project 2', 'Description...', ARRAY['Canva'], 'https://...', false, 2, '2025-04-23T00:00:00Z');
\`\`\`

### Method 3: Admin Interface Import
**Pros:**
- User-friendly
- Visual feedback
- Individual project review

**Cons:**
- Time-consuming for many projects
- Manual data entry errors

**Implementation:**
- Create CSV upload feature in admin panel
- Parse and preview data
- Allow editing before import
- Batch insert with progress indicator

---

## 4. Data Validation Rules

### Required Fields
- ✅ `title`: Must not be empty, max 100 characters
- ✅ `description`: Must not be empty
- ✅ `technologies`: Must have at least one item
- ✅ `created_at`: Must be valid date

### Optional Fields
- `live_url`: Must be valid URL if provided
- `github_url`: Can be NULL for design projects
- `image_url`: Can be NULL initially
- `featured`: Defaults to false
- `order_index`: Auto-generated if not provided

### Data Cleaning Rules
1. **Trim all string fields** to remove leading/trailing whitespace
2. **Validate URLs** using regex or URL parser
3. **Standardize status values** (Completed, In Progress, Pending, etc.)
4. **Remove duplicate projects** based on title similarity
5. **Handle special characters** in project names
6. **Convert empty strings to NULL** for optional fields

---

## 5. Import Process Steps

### Step 1: Preparation
1. ✅ Backup existing projects table
2. ✅ Review CSV data for anomalies
3. ✅ Test import script with sample data
4. ✅ Prepare rollback plan

### Step 2: Data Extraction
1. ✅ Fetch CSV from provided URL
2. ✅ Parse CSV into structured data
3. ✅ Log total records found
4. ✅ Identify and log any parsing errors

### Step 3: Data Transformation
1. ✅ Apply field mappings
2. ✅ Execute validation rules
3. ✅ Generate descriptions
4. ✅ Extract technologies
5. ✅ Convert dates
6. ✅ Clean and truncate titles

### Step 4: Data Validation
1. ✅ Check for required fields
2. ✅ Validate data types
3. ✅ Verify URL formats
4. ✅ Check for duplicates
5. ✅ Log validation errors

### Step 5: Database Insertion
1. ✅ Connect to Supabase
2. ✅ Begin transaction
3. ✅ Insert projects in batches
4. ✅ Handle insertion errors
5. ✅ Commit transaction
6. ✅ Log success/failure

### Step 6: Post-Import Verification
1. ✅ Count inserted records
2. ✅ Verify data integrity
3. ✅ Check for missing data
4. ✅ Test frontend display
5. ✅ Update order_index if needed

---

## 6. Project Organization Strategy

### Categorization Options

#### Option 1: By Status
\`\`\`
Categories:
- Completed Projects (featured = true)
- In Progress Projects (featured = false)
- Pending Projects
\`\`\`

#### Option 2: By Technology
\`\`\`
Categories:
- Canva Projects
- Figma Projects
- Multi-tool Projects
\`\`\`

#### Option 3: By Date (Recommended)
\`\`\`
Sort by: created_at DESC
Display: Most recent projects first
Pagination: 12 projects per page
\`\`\`

### Tagging Strategy
\`\`\`
Potential tags to add:
- Client name (extracted from project name)
- Project type (e.g., "Product Design", "Marketing Material")
- Complexity (based on hours spent)
- Revision count (based on revision fields)
\`\`\`

---

## 7. Security & Privacy Considerations

### Sensitive Data Handling
1. **URLs**: Store only public-facing URLs
2. **Client Information**: Anonymize client names if needed
3. **Internal Notes**: Don't import revision notes to public-facing fields
4. **Access Control**: Ensure only admin can view all project details

### Data Sanitization
\`\`\`typescript
// Sanitize URLs
function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    // Only allow https URLs
    if (parsed.protocol !== 'https:') return null
    return url
  } catch {
    return null
  }
}

// Sanitize text content
function sanitizeText(text: string): string {
  return text
    .replace(/<script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim()
}
\`\`\`

---

## 8. Post-Import Tasks

### Manual Tasks
1. ✅ Add project images (`image_url` field)
2. ✅ Review and edit project descriptions
3. ✅ Set featured projects
4. ✅ Adjust order_index for display priority
5. ✅ Add GitHub URLs if applicable

### Automated Tasks
1. ✅ Generate project thumbnails
2. ✅ Update search index
3. ✅ Clear frontend cache
4. ✅ Send notification of new projects

---

## 9. Rollback Plan

### If Import Fails
\`\`\`sql
-- Delete all projects imported in this session
DELETE FROM projects 
WHERE created_at >= '[import_start_time]' 
AND created_at <= '[import_end_time]';

-- Restore from backup
-- (Use Supabase backup/restore feature)
\`\`\`

### If Data is Incorrect
\`\`\`sql
-- Update specific fields
UPDATE projects 
SET description = '[corrected_description]'
WHERE id = [project_id];

-- Or delete and re-import
DELETE FROM projects WHERE id IN ([list_of_ids]);
\`\`\`

---

## 10. Success Metrics

### Import Success Criteria
- ✅ 100% of valid CSV rows imported
- ✅ No data loss during transformation
- ✅ All required fields populated
- ✅ URLs are valid and accessible
- ✅ Projects display correctly on frontend
- ✅ No duplicate entries

### Quality Metrics
- ✅ Title accuracy: 100%
- ✅ Description completeness: 100%
- ✅ Technology extraction: >90%
- ✅ Date conversion: 100%
- ✅ URL validation: >95%

---

## 11. Next Steps

1. **Review this plan** and approve the data mapping strategy
2. **Run the import script** with the provided CSV URL
3. **Review imported data** in the admin panel
4. **Add project images** manually through admin interface
5. **Test frontend display** to ensure projects show correctly
6. **Adjust order and featured status** as needed
7. **Document any issues** encountered during import

---

## Appendix: Sample Data Transformation

### Input (CSV Row)
\`\`\`
Sr No.: 75
Project name: SparePartsHolland - EBC - Hydraulic Top Link Cat. 1-1 with Locking Block 20 7/8" - 31 7/8" with 2 x Hose - B08JGM9QN7
Date: 24/04/2025
Design link: https://www.canva.com/design/DAGliieDy8w/...
HOURS: 1 hrs
Status: Completed
\`\`\`

### Output (Database Record)
\`\`\`json
{
  "id": 75,
  "title": "SparePartsHolland - EBC - Hydraulic Top Link Cat. 1-1 with Locking Block 20 7/8\" - 31 7/8\"...",
  "description": "Design project: SparePartsHolland - EBC - Hydraulic Top Link Cat. 1-1 with Locking Block 20 7/8\" - 31 7/8\" with 2 x Hose - B08JGM9QN7 | Time spent: 1 hrs | Status: Completed",
  "technologies": ["Canva"],
  "github_url": null,
  "live_url": "https://www.canva.com/design/DAGliieDy8w/...",
  "image_url": null,
  "featured": true,
  "order_index": 75,
  "created_at": "2025-04-24T00:00:00Z",
  "updated_at": "2025-01-27T00:00:00Z"
}
\`\`\`

---

**End of Import Plan**
