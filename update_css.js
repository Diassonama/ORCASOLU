const fs = require('fs');
const path = 'src/app/features/layout/shell.component.css';
let css = fs.readFileSync(path, 'utf8');

const newCSS = `
.shell {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-body, #f8fafc);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: #fff;
  padding: 1.5rem 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
  width: 260px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 40;
}

.shell.collapsed .sidebar {
  width: 80px;
  padding: 1.5rem 0.75rem;
}

.brand {
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #38bdf8;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.shell.collapsed .brand-text {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.25rem;
  /* hide scrollbar for general look, but allow scroll */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

nav::-webkit-scrollbar {
  width: 4px;
}
nav::-webkit-scrollbar-track {
  background: transparent;
}
nav::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

nav a {
  color: #94a3b8;
  text-decoration: none;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  transition: transform 0.2s ease;
}

.shell.collapsed a {
  padding: 0.8rem;
  justify-content: center;
}

.shell.collapsed .menu-text {
  opacity: 0;
  width: 0;
  visibility: hidden;
  transition: opacity 0.2s;
}

nav a.active {
  color: #fff;
  background: rgba(56, 189, 248, 0.1);
  font-weight: 600;
}

nav a.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 4px;
  background-color: #38bdf8;
  border-radius: 0 4px 4px 0;
}

nav a:hover:not(.active) {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.05);
}

.shell:not(.collapsed) nav a:hover .menu-icon {
  transform: scale(1.1);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.topbar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

:host-context(.dark) .topbar {
  background: rgba(30, 41, 59, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.topbar h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
}

:host-context(.dark) .topbar h2 {
  color: #f8fafc;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-info strong {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 600;
}

:host-context(.dark) .user-info strong {
  color: #f1f5f9;
}

.user-info small {
  color: #64748b;
  font-size: 0.8rem;
}

main {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

.menu-btn {
  background: transparent;
  color: #0f172a;
  padding: 0.5rem;
  font-size: 1.25rem;
  display: none;
  border: none;
  cursor: pointer;
}

:host-context(.dark) .menu-btn {
  color: #f8fafc;
}

.logout {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: transparent;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 9999px;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: pointer;
}

.logout:hover {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
}

.overlay {
  display: none;
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: -280px;
    z-index: 50;
    width: 260px;
  }

  .shell.collapsed .sidebar {
    width: 260px;
  }

  .sidebar.open {
    left: 0;
  }

  .shell.collapsed .brand-text,
  .shell.collapsed .menu-text {
    opacity: 1;
    visibility: visible;
    width: auto;
  }

  .menu-btn {
    display: inline-flex;
  }

  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 40;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  main {
    padding: 1.25rem;
  }
}
`;

fs.writeFileSync(path, newCSS);
console.log('CSS updated');
