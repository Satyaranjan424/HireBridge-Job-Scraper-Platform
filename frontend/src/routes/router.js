export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function managerPath(view = 'dashboard') {
  return `/manager/${view}`;
}

export function studentPath(view = 'dashboard') {
  return `/student/${view}`;
}

export function pathForRole(role) {
  return role === 'HIRING_MANAGER' ? managerPath() : studentPath();
}
