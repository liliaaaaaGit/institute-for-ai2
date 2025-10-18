import React, { useState, useEffect } from 'react';
import { Bug, X, Globe, AlertTriangle } from 'lucide-react';
import { getCurrentLanguage, setLanguage, getMissingKeys, type Language } from '../lib/i18n';

interface DebugPanelProps {
  usedKeys?: string[];
}

export default function DebugPanel({ usedKeys = [] }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());
  const missingKeys = getMissingKeys(usedKeys);

  useEffect(() => {
    // Show debug panel if ?debug=i18n is in URL
    const urlParams = new URLSearchParams(window.location.search);
    setIsVisible(urlParams.get('debug') === 'i18n');
  }, []);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    // Force re-render of the entire app
    window.location.reload();
  };

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-sm">i18n Debug</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Language Switcher */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Current Language
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange('de')}
              className={`px-3 py-1 text-xs rounded ${
                currentLang === 'de'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1 text-xs rounded ${
                currentLang === 'en'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Missing Keys */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            <span className="text-xs font-medium text-gray-700">
              Missing Keys ({missingKeys.length})
            </span>
          </div>
          {missingKeys.length > 0 ? (
            <div className="bg-orange-50 border border-orange-200 rounded p-2 max-h-32 overflow-y-auto">
              {missingKeys.map((key) => (
                <div key={key} className="text-xs text-orange-800 font-mono">
                  {key}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-green-600">✓ All keys found</div>
          )}
        </div>

        {/* Stats */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <div>Used keys: {usedKeys.length}</div>
          <div>Current: {currentLang.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}