// /utils/localStorageUtils.js

// Funktion zum Setzen von Daten in den LocalStorage
export function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Fehler beim Speichern von ${key} in localStorage:`, error);
  }
}

// Funktion zum Abrufen von Daten aus dem LocalStorage mit Fehlerprüfung
export function getLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Fehler beim Abrufen und Parsen von ${key} aus localStorage:`, error);
    return null;
  }
}

// Speichern der Formulardaten im LocalStorage
export function saveFormDataToLocalStorage(state) {
  setLocalStorage('cpg_formData', {
    hex: state.hex,
    prefix: state.prefix,
    suffix: state.suffix,
    sortOrder: state.sortOrder,
    checkedValues: state.checkedValues,
    selectedOption: state.selectedOption,
    darkLimit: state.darkLimit,
    brightLimit: state.brightLimit,
  });
}

// Laden der Formulardaten aus dem LocalStorage
export function loadFormDataFromLocalStorage() {
  return (
    getLocalStorage('cpg_formData') || {
      hex: '',
      prefix: '',
      suffix: '',
      sortOrder: 'ascending',
      checkedValues: [],
      selectedOption: null,
      darkLimit: 0,
      brightLimit: 100,
    }
  );
}

// Speichern der Snapshots im LocalStorage
export function saveSnapshotsToLocalStorage(snapshots) {
  setLocalStorage('cpg_snapshots', snapshots);
  // Entferne die Speicherung der 'cpg_snapshotCount' (wird nicht mehr benötigt)
}

// Laden der Snapshots aus dem LocalStorage
export function loadSnapshotsFromLocalStorage() {
  const snapshots = getLocalStorage('cpg_snapshots') || []; // Standardwert: leeres Array
  return { snapshots };
}

// Speichern des letzten verwendeten Snapshots
export function saveLastUsedSnapshotToLocalStorage(snapshot) {
  setLocalStorage('cpg_lastUsedSnapshot', snapshot);
}

// Funktion zum Laden des zuletzt verwendeten Snapshots
export function loadLastUsedSnapshotFromLocalStorage() {
  return getLocalStorage('cpg_lastUsedSnapshot') || null;
}

// Funktion zum Löschen des lastUsedSnapshot aus dem LocalStorage
export function deleteLastUsedSnapshotFromLocalStorage() {
  try {
    localStorage.removeItem('cpg_lastUsedSnapshot');
  } catch (error) {
    console.error('Fehler beim Löschen von lastUsedSnapshot aus localStorage:', error);
  }
}

// Speichern des letzten verwendeten Snapshot-Index
export function saveLastUsedSnapshotIndexToLocalStorage(index) {
  setLocalStorage('cpg_lastUsedSnapshotIndex', index);
}

// Laden des letzten verwendeten Snapshot-Index
export function loadLastUsedSnapshotIndexFromLocalStorage() {
  return getLocalStorage('cpg_lastUsedSnapshotIndex') || 0;
}
