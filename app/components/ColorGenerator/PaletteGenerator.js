// /app/components/ColorGenerator/PaletteGenerator.js

'use client';

import { useReducer, useState, useEffect, useContext } from 'react';
import {
  Wrapper,
  Title,
  InputGroup,
  Label,
  ColorPickerWrapper,
  ColorPicker,
  TextInput,
  ColorTileWrapper,
  ColorPreview,
  StyledSlider,
  SliderText,
  SliderValue,
  Select,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxInput,
  GeneratePaletteButton,
  ResetFormButton,
  CopyPaletteButton,
  PaletteWrapper,
  PaletteOutput,
  Spacer,
} from './PaletteGeneratorStyles';
import ColorPageToggleButton from '@/app/components/Button/ColorPageToggleButton';
import { FaCopy, FaSlidersH, FaRedo } from 'react-icons/fa';
import { generateMonochromePalette, getColorPreview } from '@/utils/paletteGeneratorUtils';
import SnapshotController from './SnapshotController';
import { loadFormDataFromLocalStorage, saveFormDataToLocalStorage } from '@/utils/localStorageUtils';
import LanguageContext from '@/app/components/Provider/LanguageProvider';
import { getText } from '@/lib/languageLibrary';

const defaults = {
  hex: '#186595',
  prefix: '--color-',
  suffix: 'primary',
  sortOrder: 'asc',
  checkedValues: [
    0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000,
  ],
  selectedOption: 'optionDefault',
  darkLimit: 10,
  brightLimit: 98,
  generatedPalette: null,
};

const selectorOptions = {
  selector_option_default: [
    0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000,
  ],
  selector_option_1: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  selector_option_2: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  selector_option_3: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  selector_option_4: [0, 200, 400, 600, 800, 1000],
  selector_option_5: [200, 400, 600, 800],
  selector_option_none: [],
};

const allValues = [
  0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000,
];

// ===== Hilfsfunktion zum Vergleichen von Arrays =====
function isArraysEqual(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

// ===== Reducer zur Verwaltung des Formularzustands =====
function paletteReducer(state, action) {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, [action.key]: action.value };
    case 'RESET_FORM':
      return { ...defaults };
    case 'SET_CHECKED_VALUES':
      return { ...state, checkedValues: action.value };
    case 'SET_SELECTED_OPTION':
      return { ...state, selectedOption: action.value };
    case 'SET_GENERATED_PALETTE':
      return { ...state, generatedPalette: action.value };
    case 'LOAD_SNAPSHOT':
      return { ...action.payload };
    default:
      return state;
  }
}

// ===== Formulardaten auf Validität prüfen =====
function validateFormData(data) {
  if (!data) return defaults;

  const isValid =
    typeof data.hex === 'string' &&
    data.hex.length > 0 &&
    typeof data.prefix === 'string' &&
    typeof data.suffix === 'string' &&
    ['asc', 'desc'].includes(data.sortOrder) &&
    Array.isArray(data.checkedValues) &&
    typeof data.selectedOption === 'string' &&
    typeof data.darkLimit === 'number' &&
    typeof data.brightLimit === 'number';

  return isValid ? data : defaults;
}

// ===== Initiale Formular-Daten aus LocalStorage laden =====
const initialFormData = validateFormData(loadFormDataFromLocalStorage()) || defaults;

export default function PaletteGenerator() {
  const { language } = useContext(LanguageContext);
  const [state, dispatch] = useReducer(paletteReducer, initialFormData);
  const [isPageColorActive, setIsPageColorActive] = useState(() => {
    const storedValue = localStorage.getItem('cpg_autoColorPage');
    return storedValue !== null ? JSON.parse(storedValue) : false;
  });

  // ===== Sprachtext-Abfrage
  const getLanguageText = (key) => {
    return getText('palette_generator', key, language);
  };

  // ===== Zustand für visuelle Effekte =====
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerateClicked, setIsGenerateClicked] = useState(false);

  // ===== Formularzustand in LocalStorage speichern =====
  useEffect(() => {
    const validatedData = validateFormData(state);
    saveFormDataToLocalStorage(validatedData);
  }, [state]);

  // ===== Snapshot anwenden =====
  function applySnapshot(snapshot) {
    dispatch({ type: 'LOAD_SNAPSHOT', payload: snapshot });
  }

  // ===== Farbwerte-Änderungen =====
  const handleHexChange = (e) => {
    dispatch({ type: 'SET_VALUE', key: 'hex', value: e.target.value });
  };

  const handleColorPickerChange = (e) => {
    dispatch({ type: 'SET_VALUE', key: 'hex', value: e.target.value });
  };

  // ===== Temporäre Palette anwenden =====
  const applyPaletteToPage = (palette) => {
    Object.entries(palette).forEach(([key, value]) => {
      const colorKey = key.split('-').pop();
      document.documentElement.style.setProperty(`--color-primary-${colorKey}`, value);
    });
  };

  // ===== Seite einfärben basierend auf Toggle =====
  const handleTogglePageColors = () => {
    setIsPageColorActive((prev) => {
      const newValue = !prev;

      // Speichere den neuen Wert in den Local Storage
      localStorage.setItem('cpg_autoColorPage', JSON.stringify(newValue));

      if (newValue) {
        // Aktivieren: Aktuellen Zustand einfärben
        const palette = generateMonochromePalette(
          state.hex,
          state.prefix,
          state.suffix,
          state.darkLimit,
          state.brightLimit
        );
        applyPaletteToPage(palette);
      } else {
        // Deaktivieren: Standard-Palette anwenden
        const defaultPalette = generateMonochromePalette(
          defaults.hex,
          defaults.prefix,
          defaults.suffix,
          defaults.darkLimit,
          defaults.brightLimit
        );
        applyPaletteToPage(defaultPalette);
      }

      return newValue;
    });
  };

  // Automatisches Anwenden der Einfärbung bei Änderungen des Zustands
  useEffect(() => {
    if (isPageColorActive) {
      const palette = generateMonochromePalette(
        state.hex,
        state.prefix,
        state.suffix,
        state.darkLimit,
        state.brightLimit
      );
      applyPaletteToPage(palette);
    }
  }, [state, isPageColorActive]);

  // ===== Palette generieren =====
  const handleGeneratePalette = () => {
    setIsGenerateClicked(true);
    setTimeout(() => setIsGenerateClicked(false), 200);

    // Generiere die Palette
    const palette = generateMonochromePalette(
      state.hex,
      state.prefix,
      state.suffix,
      state.darkLimit,
      state.brightLimit
    );

    // Filtere die Palette basierend auf den checkedValues
    const filteredPalette = Object.entries(palette)
      .filter(([key]) => state.checkedValues.includes(parseInt(key.split('-').pop())))
      .sort(([keyA], [keyB]) => {
        const valA = parseInt(keyA.split('-').pop());
        const valB = parseInt(keyB.split('-').pop());
        return state.sortOrder === 'asc' ? valA - valB : valB - valA;
      })
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    dispatch({ type: 'SET_GENERATED_PALETTE', value: filteredPalette });
  };

  // ===== Formular zurücksetzen =====
  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  // ===== Palette kopieren =====
  const handleCopyPalette = () => {
    const brightLimitDisplayed = 100 - state.brightLimit;
    const darkLimitDisplayed = 100 - state.darkLimit;

    const comment =
      `/* ${state.prefix}${state.suffix}-base: ${state.hex}; */\n` +
      `/* Light level (0): ${brightLimitDisplayed}% | Dark level (1000): ${darkLimitDisplayed}% */\n`;

    const paletteText = Object.entries(state.generatedPalette)
      .map(([key, value]) => `${key.toLowerCase()}: ${value.toLowerCase()};`)
      .join('\n');

    navigator.clipboard.writeText(comment + paletteText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // ===== Option auswählen =====
  const handleSelectOption = (option) => {
    dispatch({ type: 'SET_SELECTED_OPTION', value: option });
    dispatch({ type: 'SET_CHECKED_VALUES', value: selectorOptions[option] || [] });
  };

  // ===== Formular auf Änderungen prüfen =====
  const isFormChanged = () => {
    return (
      state.hex !== defaults.hex ||
      state.prefix !== defaults.prefix ||
      state.suffix !== defaults.suffix ||
      state.sortOrder !== defaults.sortOrder ||
      !isArraysEqual(state.checkedValues, defaults.checkedValues) ||
      state.selectedOption !== defaults.selectedOption ||
      state.darkLimit !== defaults.darkLimit ||
      state.brightLimit !== defaults.brightLimit
    );
  };

  return (
    <Wrapper>
      <SnapshotController state={state} onApplySnapshot={applySnapshot} resetForm={resetForm} />

      <Title>{getLanguageText('title')}</Title>

      <ColorPageToggleButton isPageColorActive={isPageColorActive} onToggle={handleTogglePageColors} />

      <InputGroup>
        <Label>{getLanguageText('hex_label')}</Label>
        <ColorPickerWrapper>
          <ColorPicker type='color' value={state.hex} onChange={handleColorPickerChange} />
          <TextInput type='text' value={state.hex} onChange={handleHexChange} placeholder='#' />
        </ColorPickerWrapper>
      </InputGroup>

      <InputGroup>
        <Label>{getLanguageText('bright_limit_label')}</Label>
        <ColorTileWrapper>
          <ColorPreview $bgColor={getColorPreview(state.hex, state.brightLimit)} />
          <SliderText>
            <span>{getLanguageText('adjust_labels_darker')}</span>
          </SliderText>
          <StyledSlider
            type='range'
            min={70}
            max={100}
            value={state.brightLimit}
            onChange={(e) => dispatch({ type: 'SET_VALUE', key: 'brightLimit', value: parseInt(e.target.value) })}
            $startColor='var(--color-white)'
            $endColor={getColorPreview(state.hex, state.brightLimit)}
            $thumbColor='var(--color-white)'
            $thumbBorderColor='var(--color-secondary-700)'
          />
          <SliderText>
            <span>{getLanguageText('adjust_labels_lighter')}</span>
          </SliderText>
          <SliderValue>{-(state.brightLimit - 100)}</SliderValue>
        </ColorTileWrapper>
      </InputGroup>

      <InputGroup>
        <Label>{getLanguageText('dark_limit_label')}</Label>
        <ColorTileWrapper>
          <ColorPreview $bgColor={getColorPreview(state.hex, state.darkLimit)} />
          <SliderText>
            <SliderText>
              <span>{getLanguageText('adjust_labels_darker')}</span>
            </SliderText>
          </SliderText>
          <StyledSlider
            type='range'
            min={0}
            max={30}
            value={state.darkLimit}
            onChange={(e) => dispatch({ type: 'SET_VALUE', key: 'darkLimit', value: parseInt(e.target.value) })}
            $startColor={getColorPreview(state.hex, state.darkLimit)}
            $endColor={getColorPreview(state.hex, state.darkLimit)}
            $thumbColor='var(--color-white)'
            $thumbBorderColor='var(--color-secondary-700)'
          />

          <SliderText>
            <span>{getLanguageText('adjust_labels_lighter')}</span>
          </SliderText>
          <SliderValue>{100 - state.darkLimit}</SliderValue>
        </ColorTileWrapper>
      </InputGroup>

      <InputGroup>
        <Label>{getLanguageText('prefix_label')}</Label>
        <TextInput
          type='text'
          value={state.prefix}
          onChange={(e) => dispatch({ type: 'SET_VALUE', key: 'prefix', value: e.target.value })}
          placeholder='--color-'
        />
      </InputGroup>

      <InputGroup>
        <Label>{getLanguageText('suffix_label')}</Label>
        <TextInput
          type='text'
          value={state.suffix}
          onChange={(e) => dispatch({ type: 'SET_VALUE', key: 'suffix', value: e.target.value })}
          placeholder='test'
        />
      </InputGroup>

      <InputGroup>
        <Label>{getLanguageText('sort_order_label')}</Label>
        <Select
          value={state.sortOrder}
          onChange={(e) => dispatch({ type: 'SET_VALUE', key: 'sortOrder', value: e.target.value })}>
          <option value='asc'>{getLanguageText('sort_order_asc')}</option>
          <option value='desc'>{getLanguageText('sort_order_desc')}</option>
        </Select>
      </InputGroup>

      <InputGroup>
        <Label>{getLanguageText('output_values_label')}</Label>

        <Select value={state.selectedOption} onChange={(e) => handleSelectOption(e.target.value)}>
          {Object.keys(selectorOptions).map((option) => {
            return (
              <option key={option} value={option}>
                {getText('palette_generator', option, language)}
              </option>
            );
          })}
        </Select>
      </InputGroup>

      <InputGroup>
        <CheckboxGroup>
          {allValues.map((value) => (
            <CheckboxLabel key={value}>
              <CheckboxInput
                type='checkbox'
                checked={state.checkedValues.includes(value)}
                onChange={() => {
                  const newCheckedValues = state.checkedValues.includes(value)
                    ? state.checkedValues.filter((item) => item !== value)
                    : [...state.checkedValues, value];
                  dispatch({ type: 'SET_CHECKED_VALUES', value: newCheckedValues });
                }}
              />
              {value}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </InputGroup>

      <GeneratePaletteButton width='100%' onClick={handleGeneratePalette}>
        <FaSlidersH /> {getLanguageText('generate_button')}
      </GeneratePaletteButton>

      {isFormChanged() && (
        <ResetFormButton width='auto' onClick={resetForm}>
          <FaRedo /> {getLanguageText('reset_button')}
        </ResetFormButton>
      )}

      {state.generatedPalette && Object.entries(state.generatedPalette).length > 0 && (
        <PaletteWrapper>
          <CopyPaletteButton width='auto' onClick={handleCopyPalette}>
            <FaCopy /> {isCopied ? getLanguageText('copied') : getLanguageText('copy_button')}
          </CopyPaletteButton>

          <PaletteOutput>
            {Object.entries(state.generatedPalette)
              .map(([key, value]) => `${key.toLowerCase()}: ${value.toLowerCase()};`)
              .join('\n')}
          </PaletteOutput>
        </PaletteWrapper>
      )}
    </Wrapper>
  );
}
