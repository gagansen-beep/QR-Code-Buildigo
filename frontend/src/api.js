const BASE = '/api/cards';

// ── Standard request → returns json.data ──────────────────────────────────────
async function request(method, path, body = null, isFormData = false) {
  const options = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  };
  if (body !== null) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  let json;
  try {
    const res = await fetch(`${BASE}${path}`, options);
    json = await res.json();
    if (!res.ok) {
      const err = new Error(json?.message || 'Request failed');
      err.errors = json?.errors ?? {};
      err.status = res.status;
      throw err;
    }
    return json.data;
  } catch (err) {
    if (err.status) throw err;
    const netErr = new Error('Network error — please check your connection');
    netErr.errors = {};
    netErr.status = 0;
    throw netErr;
  }
}

// ── Paginated request → returns { data, total, page, limit } ─────────────────
async function requestPaginated(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  };

  let json;
  try {
    const res = await fetch(`${BASE}${path}`, options);
    json = await res.json();
    if (!res.ok) {
      const err = new Error(json?.message || 'Request failed');
      err.errors = json?.errors ?? {};
      err.status = res.status;
      throw err;
    }
    const { success: _s, ...rest } = json;
    return rest; // { data, total, page, limit }
  } catch (err) {
    if (err.status) throw err;
    const netErr = new Error('Network error — please check your connection');
    netErr.errors = {};
    netErr.status = 0;
    throw netErr;
  }
}

export const api = {
  /** Create a new card (multipart/form-data) */
  createCard: (formData) => request('POST', '/', formData, true),

  /** Update a card by ID (multipart/form-data) */
  updateCard: (id, formData) => request('PUT', `/${id}`, formData, true),

  /** Delete a card by ID */
  deleteCard: (id) => request('DELETE', `/${id}`),

  /** Fetch a single card by ID (public) */
  getCard: (id) => request('GET', `/${id}`),

  /** Get all cards (public) — returns { data, total, page, limit } */
  getAllCards: (page = 1, limit = 10, email = '', phone = '') => {
    const params = new URLSearchParams({ page, limit });
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
    return requestPaginated('GET', `/?${params}`);
  },

  // ── Admin API ───────────────────────────────────────────────────────────────

  /** Get ALL cards (admin only) — returns { data, total, page, limit } */
  adminGetAll: (email, password, page = 1, limit = 10) =>
    requestPaginated('POST', `/admin/all?page=${page}&limit=${limit}`, { email, password }),

  /** Admin update any card */
  adminUpdateCard: (id, formData) => request('PUT', `/admin/${id}`, formData, true),

  /** Admin delete any card */
  adminDeleteCard: (id, adminEmail, adminPassword) =>
    request('DELETE', `/admin/${id}`, { admin_email: adminEmail, admin_password: adminPassword }),

  /** Submit a Contact Us enquiry */
  submitEnquiry: (data) => request('POST', '/contact/create', data),

  /** Get all enquiries (paginated, optional email filter) */
  getAllEnquiries: (page = 1, limit = 10, email = '') => {
    const params = new URLSearchParams({ page, limit });
    if (email) params.set('email', email);
    return requestPaginated('GET', `/contact/?${params}`);
  },

  /** Delete an enquiry by ID */
  deleteEnquiry: (id) => request('DELETE', `/contact/${id}`),
};
