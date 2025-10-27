# CSV Import Testing & Troubleshooting Plan

## Overview
Comprehensive testing plan for troubleshooting and validating the CSV data upload functionality for design projects import.

---

## 1. Pre-Import Validation

### 1.1 CSV File Format Verification
**Objective:** Ensure CSV file meets expected format requirements

**Test Steps:**
1. Verify CSV has correct headers:
   - `Sr No.`, `Project name`, `Date`, `Design link`, `Content Link`, `Drive Design link`, `HOURS`, `Revision Required`, `Revisions design`, `Revision content`, `Client feedback`, `Status`
2. Check for proper delimiter (comma-separated)
3. Validate no missing required columns
4. Confirm consistent column count across all rows

**Expected Result:** CSV structure matches schema definition

**Validation Script:**
\`\`\`javascript
function validateCSVStructure(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const requiredHeaders = ['Project name', 'Date', 'Design link', 'HOURS', 'Status'];
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }
  
  return { valid: true, headers, rowCount: lines.length - 1 };
}
\`\`\`

---

### 1.2 File Encoding Check
**Objective:** Ensure proper character encoding

**Test Steps:**
1. Verify UTF-8 encoding
2. Check for BOM (Byte Order Mark) issues
3. Test special characters handling
4. Validate line endings (CRLF vs LF)

**Common Issues:**
- Excel exports may use Windows-1252 encoding
- Special characters (é, ñ, etc.) may appear corrupted
- Line ending inconsistencies

**Fix:**
\`\`\`javascript
function normalizeEncoding(csvText) {
  // Remove BOM if present
  if (csvText.charCodeAt(0) === 0xFEFF) {
    csvText = csvText.slice(1);
  }
  
  // Normalize line endings
  csvText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  return csvText;
}
\`\`\`

---

## 2. Data Parsing Tests

### 2.1 CSV Parser Validation
**Objective:** Ensure CSV is correctly parsed into structured data

**Test Cases:**
1. **Empty rows:** Skip blank lines
2. **Quoted values:** Handle commas within quoted strings
3. **Escaped quotes:** Handle `""` within values
4. **Missing values:** Handle empty cells gracefully

**Test Data:**
\`\`\`csv
Sr No.,Project name,Date,Design link,HOURS,Status
1,"Test Project, Inc.",01/01/2024,https://example.com,2 hrs,Completed
2,Simple Project,02/01/2024,,1 hrs,
3,"Project with ""quotes""",03/01/2024,https://example.com,3 hrs,In Progress
\`\`\`

**Validation:**
\`\`\`javascript
function testCSVParsing(csvText) {
  const parsed = parseCSV(csvText);
  
  console.log('[v0] Parsed rows:', parsed.length);
  console.log('[v0] Sample row:', parsed[0]);
  
  // Verify each row has expected structure
  parsed.forEach((row, index) => {
    if (!row['Project name']) {
      console.warn(`[v0] Row ${index + 1}: Missing project name`);
    }
  });
  
  return parsed;
}
\`\`\`

---

### 2.2 Data Type Validation
**Objective:** Ensure data types match database schema

**Validation Rules:**
| Field | Type | Validation |
|-------|------|------------|
| Project name | String | Max 100 chars, not empty |
| Date | Date | Valid date format (DD/MM/YYYY) |
| Design link | URL | Valid URL or null |
| HOURS | String | Contains time information |
| Status | String | One of: Completed, In Progress, Pending |

**Implementation:**
\`\`\`javascript
function validateProjectData(project) {
  const errors = [];
  
  // Title validation
  if (!project.title || project.title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (project.title.length > 100) {
    errors.push('Title exceeds 100 characters');
  }
  
  // URL validation
  if (project.live_url) {
    try {
      new URL(project.live_url);
    } catch {
      errors.push('Invalid design link URL');
    }
  }
  
  // Date validation
  if (project.created_at) {
    const date = new Date(project.created_at);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    }
  }
  
  return { valid: errors.length === 0, errors };
}
\`\`\`

---

## 3. Database Import Tests

### 3.1 Connection Verification
**Objective:** Ensure database connection is established

**Test Steps:**
1. Verify Supabase environment variables are set
2. Test database connection
3. Confirm projects table exists
4. Validate table schema matches expectations

**Diagnostic Query:**
\`\`\`javascript
async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('[v0] Database error:', error);
      return false;
    }
    
    console.log('[v0] Database connection successful');
    return true;
  } catch (error) {
    console.error('[v0] Connection failed:', error);
    return false;
  }
}
\`\`\`

---

### 3.2 Insert Operation Testing
**Objective:** Verify data is correctly inserted into database

**Test Procedure:**
1. Insert single test record
2. Verify record appears in database
3. Check all fields are populated correctly
4. Test batch insert with multiple records

**Sample Test:**
\`\`\`javascript
async function testSingleInsert() {
  const testProject = {
    title: 'Test Project',
    description: 'Test description',
    technologies: ['Canva'],
    live_url: 'https://example.com',
    featured: false,
    order_index: 0,
    created_at: new Date().toISOString()
  };
  
  console.log('[v0] Inserting test project:', testProject);
  
  const { data, error } = await supabase
    .from('projects')
    .insert(testProject)
    .select();
  
  if (error) {
    console.error('[v0] Insert failed:', error);
    return false;
  }
  
  console.log('[v0] Insert successful:', data);
  return true;
}
\`\`\`

---

## 4. Error Handling Tests

### 4.1 Network Errors
**Test Scenarios:**
- Invalid CSV URL
- Network timeout
- CORS issues
- 404 Not Found

**Error Handling:**
\`\`\`javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`[v0] Fetch attempt ${i + 1}/${maxRetries}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error(`[v0] Fetch failed (attempt ${i + 1}):`, error);
      
      if (i === maxRetries - 1) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
\`\`\`

---

### 4.2 Data Validation Errors
**Test Cases:**
- Missing required fields
- Invalid data types
- Constraint violations
- Duplicate entries

**Validation Flow:**
\`\`\`javascript
function validateAndCleanProject(csvRow, index) {
  const errors = [];
  
  try {
    // Required field check
    if (!csvRow['Project name']) {
      errors.push(`Row ${index}: Missing project name`);
    }
    
    // Data type validation
    if (csvRow['Design link'] && !isValidURL(csvRow['Design link'])) {
      errors.push(`Row ${index}: Invalid URL format`);
    }
    
    // Return cleaned data or errors
    if (errors.length > 0) {
      return { success: false, errors };
    }
    
    return {
      success: true,
      data: transformToProject(csvRow, index)
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Row ${index}: ${error.message}`]
    };
  }
}
\`\`\`

---

## 5. User Feedback & Logging

### 5.1 Progress Tracking
**Implementation:**
\`\`\`javascript
async function importWithProgress(projects) {
  const total = projects.length;
  let completed = 0;
  let failed = 0;
  const errors = [];
  
  for (const project of projects) {
    try {
      console.log(`[v0] Importing ${completed + 1}/${total}: ${project.title}`);
      
      await insertProject(project);
      completed++;
      
      // Update UI progress
      updateProgress({ completed, total, failed });
    } catch (error) {
      failed++;
      errors.push({ project: project.title, error: error.message });
      console.error(`[v0] Failed to import "${project.title}":`, error);
    }
  }
  
  return { completed, failed, errors };
}
\`\`\`

---

### 5.2 Detailed Error Reporting
**Error Log Format:**
\`\`\`javascript
function generateErrorReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      successful: results.completed,
      failed: results.failed,
      successRate: `${((results.completed / results.total) * 100).toFixed(2)}%`
    },
    errors: results.errors.map(err => ({
      project: err.project,
      error: err.error,
      suggestion: getSuggestion(err.error)
    }))
  };
  
  console.log('[v0] Import Report:', JSON.stringify(report, null, 2));
  return report;
}
\`\`\`

---

## 6. Security & Permissions

### 6.1 Authentication Check
**Verification:**
\`\`\`javascript
async function verifyAdminAccess() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    console.log('[v0] User authenticated:', user.email);
    return true;
  } catch (error) {
    console.error('[v0] Authentication failed:', error);
    return false;
  }
}
\`\`\`

---

### 6.2 Input Sanitization
**Security Measures:**
\`\`\`javascript
function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  
  // Remove potentially dangerous characters
  return value
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}
\`\`\`

---

## 7. Sample Test Data

### 7.1 Valid CSV Sample
\`\`\`csv
Sr No.,Project name,Date,Design link,Content Link,Drive Design link,HOURS,Revision Required,Revisions design,Revision content,Client feedback,Status
1,E-commerce Product Banner,15/01/2024,https://canva.com/design/abc123,https://docs.google.com/doc1,https://drive.google.com/folder1,2 hrs,No,N/A,N/A,Approved,Completed
2,Social Media Campaign,20/01/2024,https://canva.com/design/def456,https://docs.google.com/doc2,https://drive.google.com/folder2,3 hrs,Yes,Minor color adjustments,Text updates,Pending review,In Progress
\`\`\`

---

### 7.2 Edge Case CSV Sample
\`\`\`csv
Sr No.,Project name,Date,Design link,Content Link,Drive Design link,HOURS,Revision Required,Revisions design,Revision content,Client feedback,Status
1,"Project with, comma",01/01/2024,,,,,,,,,
2,Missing Date,,https://example.com,,,1 hrs,,,,,Completed
3,"Project with ""quotes""",15/01/2024,invalid-url,,,2 hrs,,,,,Completed
\`\`\`

---

## 8. Debugging Checklist

### Step-by-Step Troubleshooting

- [ ] **Step 1:** Verify CSV URL is accessible
  \`\`\`javascript
  console.log('[v0] Testing CSV URL:', csvUrl);
  fetch(csvUrl).then(r => console.log('[v0] Response status:', r.status));
  \`\`\`

- [ ] **Step 2:** Check CSV content structure
  \`\`\`javascript
  const csvText = await response.text();
  console.log('[v0] CSV first 500 chars:', csvText.substring(0, 500));
  console.log('[v0] Total lines:', csvText.split('\n').length);
  \`\`\`

- [ ] **Step 3:** Validate parsed data
  \`\`\`javascript
  const parsed = parseCSV(csvText);
  console.log('[v0] Parsed projects:', parsed.length);
  console.log('[v0] First project:', parsed[0]);
  \`\`\`

- [ ] **Step 4:** Test database connection
  \`\`\`javascript
  const connected = await testDatabaseConnection();
  console.log('[v0] Database connected:', connected);
  \`\`\`

- [ ] **Step 5:** Attempt single insert
  \`\`\`javascript
  const result = await testSingleInsert();
  console.log('[v0] Test insert result:', result);
  \`\`\`

- [ ] **Step 6:** Review error logs
  \`\`\`javascript
  // Check browser console for [v0] prefixed logs
  // Check network tab for failed requests
  \`\`\`

---

## 9. Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| CORS Error | "Access blocked by CORS policy" | Use proxy or ensure CSV URL allows cross-origin requests |
| Parse Error | "Unexpected token" | Check for malformed CSV, extra commas, or encoding issues |
| Insert Fails | "Constraint violation" | Verify data types match schema, check for required fields |
| Timeout | "Request timeout" | Reduce batch size, implement retry logic |
| Auth Error | "Not authenticated" | Verify user is logged in to admin panel |

---

## 10. Performance Optimization

### Batch Processing
\`\`\`javascript
async function importInBatches(projects, batchSize = 10) {
  const batches = [];
  
  for (let i = 0; i < projects.length; i += batchSize) {
    batches.push(projects.slice(i, i + batchSize));
  }
  
  console.log(`[v0] Processing ${batches.length} batches of ${batchSize}`);
  
  for (let i = 0; i < batches.length; i++) {
    console.log(`[v0] Batch ${i + 1}/${batches.length}`);
    await Promise.all(batches[i].map(p => insertProject(p)));
  }
}
\`\`\`

---

## 11. Post-Import Verification

### Verification Checklist
- [ ] Count imported projects matches CSV row count
- [ ] Spot-check random projects for data accuracy
- [ ] Verify all URLs are clickable
- [ ] Check featured projects are marked correctly
- [ ] Confirm technologies array is populated
- [ ] Validate dates are in correct format

### Verification Query
\`\`\`javascript
async function verifyImport(expectedCount) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(expectedCount);
  
  console.log('[v0] Imported projects:', data?.length);
  console.log('[v0] Sample project:', data?.[0]);
  
  return data?.length === expectedCount;
}
\`\`\`

---

## 12. Rollback Procedure

### In Case of Failed Import
\`\`\`javascript
async function rollbackImport(startTime) {
  console.log('[v0] Rolling back imports after:', startTime);
  
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .gte('created_at', startTime);
  
  if (error) {
    console.error('[v0] Rollback failed:', error);
    return false;
  }
  
  console.log('[v0] Rollback successful');
  return true;
}
\`\`\`

---

## Conclusion

This comprehensive testing plan ensures robust CSV import functionality with proper error handling, validation, and user feedback. Follow the checklist systematically to identify and resolve any import issues.
