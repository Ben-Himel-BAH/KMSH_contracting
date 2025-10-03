# Security Vulnerability Assessment Report

**Generated:** 2025-10-03 10:36:38  
**Scanner:** Software Vulnerability Assessment Agent  
**Project:** KMSH_contracting  

---

## Executive Summary

This report contains the results of an automated security vulnerability assessment performed on the KMSH_contracting codebase. The scan identified potential security weaknesses using pattern-based detection and security best practices.

### Scan Overview
- **Files Scanned:** 19
- **Total Vulnerabilities Found:** 31
- **Scan Type:** Pattern-Based Only

### Vulnerability Breakdown by Severity
- **HIGH:** 31 🟠

---

## Detailed Vulnerability Findings

### 📁 artifacts.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\artifacts.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 138

**Code:**
```python
raise ArtifactNotFoundError(f"Artifact not found: {final}")
```

**Pattern Match:** `f"Artifact not found: {final}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 170

**Code:**
```python
f"Artifact already exists: {path}. Pass overwrite=True to replace."
```

**Pattern Match:** `f"Artifact already exists: {path}. Pass overwrite=True to replace."`

---

#### 3. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 195

**Code:**
```python
f"Unsupported content type: {type(content)!r}"
```

**Pattern Match:** `f"Unsupported content type: {type(content)!r}"`

---

### 📁 audio.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\audio.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 34

**Code:**
```python
f"Audio file not found at {audio_path}",
```

**Pattern Match:** `f"Audio file not found at {audio_path}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 63

**Code:**
```python
f"Audio file not found at {audio_path}",
```

**Pattern Match:** `f"Audio file not found at {audio_path}"`

---

### 📁 errors.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\errors.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 37

**Code:**
```python
super().__init__(f"[{provider}:{model}] {operation} error: {message}")
```

**Pattern Match:** `f"[{provider}:{model}] {operation} error: {message}"`

---

### 📁 image_gen.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\image_gen.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 19

**Code:**
```python
filename = f"image_{int(time.time())}{ext}"
```

**Pattern Match:** `f"image_{int(time.time())}{ext}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 23

**Code:**
```python
image_url = f"data:{image_mime};base64,{image_data_base64}"
```

**Pattern Match:** `f"data:{image_mime};base64,{image_data_base64}"`

---

### 📁 llm.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\llm.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 494

**Code:**
```python
f"Original input: {user_input}"
```

**Pattern Match:** `f"Original input: {user_input}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 505

**Code:**
```python
f"actual_model: {actual_model}, provider: {provider}. "
```

**Pattern Match:** `f"actual_model: {actual_model}, provider: {provider}. "`

---

#### 3. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 506

**Code:**
```python
f"Original input: {user_input}"
```

**Pattern Match:** `f"Original input: {user_input}"`

---

#### 4. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 525

**Code:**
```python
f"{e}. Original input: {user_input}",
```

**Pattern Match:** `f"{e}. Original input: {user_input}"`

---

### 📁 models.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\models.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 115

**Code:**
```python
return f"{int(x):,}"
```

**Pattern Match:** `f"{int(x):,}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 120

**Code:**
```python
f"| {model_name} | {model_provider or '-'} | {'✅' if model_text else '❌'} | "
```

**Pattern Match:** `f"| {model_name} | {model_provider or '-'} | {'`

---

#### 3. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 121

**Code:**
```python
f"{'✅' if model_vision else '❌'} | {'✅' if model_image else '❌'} | "
```

**Pattern Match:** `f"{'✅' if model_vision else '❌'} | {'`

---

#### 4. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 122

**Code:**
```python
f"{'✅' if model_image_mod else '❌'} | {'✅' if model_audio else '❌'} | "
```

**Pattern Match:** `f"{'✅' if model_image_mod else '❌'} | {'`

---

#### 5. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 123

**Code:**
```python
f"{_fmt_num(context)} | {_fmt_num(max_tokens)} |"
```

**Pattern Match:** `f"{_fmt_num(context)} | {_fmt_num(max_tokens)} |"`

---

### 📁 plantuml.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\plantuml.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 61

**Code:**
```python
raise ArtifactError(f"PlantUML rendering failed: {exc}") from exc
```

**Pattern Match:** `f"PlantUML rendering failed: {exc}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 69

**Code:**
```python
raise ArtifactError(f"PlantUML rendering failed: {exc}") from exc
```

**Pattern Match:** `f"PlantUML rendering failed: {exc}"`

---

#### 3. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 76

**Code:**
```python
detail = "; ".join(f"{label}: {err}" for label, err in attempts)
```

**Pattern Match:** `f"{label}: {err}"`

---

#### 4. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 77

**Code:**
```python
message = f"PlantUML rendering failed after attempts [{detail}]: {exc}"
```

**Pattern Match:** `f"PlantUML rendering failed after attempts [{detail}]: {exc}"`

---

#### 5. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 79

**Code:**
```python
message = f"PlantUML rendering failed: {exc}"
```

**Pattern Match:** `f"PlantUML rendering failed: {exc}"`

---

### 📁 rate_limit.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\rate_limit.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 38

**Code:**
```python
env = f"UTILS_RATE_LIMIT_QPS_{provider.upper()}"
```

**Pattern Match:** `f"UTILS_RATE_LIMIT_QPS_{provider.upper()}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 54

**Code:**
```python
key = f"{provider}:{api_key}:{model_name}"
```

**Pattern Match:** `f"{provider}:{api_key}:{model_name}"`

---

### 📁 anthropic.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\providers\anthropic.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 93

**Code:**
```python
f"Could not load image from {image_path_or_url}"
```

**Pattern Match:** `f"Could not load image from {image_path_or_url}"`

---

### 📁 google.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\providers\google.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 158

**Code:**
```python
"google", model_name, "image_generation", f"API call failed: {e}"
```

**Pattern Match:** `f"API call failed: {e}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 293

**Code:**
```python
f"Could not load image from {image_path_or_url}"
```

**Pattern Match:** `f"Could not load image from {image_path_or_url}"`

---

#### 3. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 334

**Code:**
```python
"google", model_name, "vision_completion", f"API call failed: {e}"
```

**Pattern Match:** `f"API call failed: {e}"`

---

#### 4. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 422

**Code:**
```python
"google", model_name, "image_edit", f"Edit failed: {e}"
```

**Pattern Match:** `f"Edit failed: {e}"`

---

### 📁 openai.py

**File Path:** `c:\Users\labadmin\Documents\repo\KMSH_contracting\utils\providers\openai.py`

#### 1. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 201

**Code:**
```python
image_url = f"data:{mime_type};base64,{image_base64}"
```

**Pattern Match:** `f"data:{mime_type};base64,{image_base64}"`

---

#### 2. 🟠 HIGH - Sql Injection

**Description:** Potential SQL Injection vulnerability

**Location:** Line 268

**Code:**
```python
image_url = f"data:{mime_type};base64,{image_base64}"
```

**Pattern Match:** `f"data:{mime_type};base64,{image_base64}"`

---

## 🎯 Security Recommendations

### Immediate Actions Required
1. **Address CRITICAL vulnerabilities immediately** - These pose severe security risks
2. **Fix HIGH severity issues within 24-48 hours** - These are significant security concerns
3. **Plan remediation for MEDIUM severity issues** - Schedule fixes in upcoming sprints
4. **Consider LOW severity issues for future hardening** - Include in technical debt backlog

### Security Best Practices
1. **Input Validation:** Implement proper input validation and sanitization
2. **Secrets Management:** Store secrets in environment variables, not hardcoded
3. **Secure Coding:** Use parameterized queries to prevent SQL injection
4. **Cryptography:** Use strong cryptographic algorithms (SHA-256, AES-256)
5. **Random Generation:** Use secure random generators from the 'secrets' module
6. **Error Handling:** Implement proper error handling without exposing sensitive information
7. **Security Headers:** Add appropriate security headers to web responses
8. **Logging:** Implement comprehensive security event logging

### Ongoing Security Measures
1. **Regular Updates:** Set up automated dependency updates
2. **Security Monitoring:** Implement continuous security scanning
3. **Penetration Testing:** Conduct regular security assessments
4. **Security Training:** Keep development team updated on security best practices
5. **Incident Response:** Maintain a security incident response plan
6. **Code Reviews:** Include security considerations in code review process
7. **Security Metrics:** Track security debt and improvements over time

---

## Report Metadata

**Scanner Version:** Software Vulnerability Assessment Agent v1.0  
**Scan Method:** Pattern-based detection with regex matching  
**File Types:** Python (.py) files  
**Excluded:** Test files, __pycache__ directories  

*This report was generated automatically. Manual security review is recommended for comprehensive assessment.*
