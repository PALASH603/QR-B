/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import { toPng } from 'html-to-image';
import { 
  QrCode, 
  Barcode, 
  Download, 
  Palette, 
  Type, 
  Share2, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Github, 
  Globe, 
  Mail, 
  Phone, 
  MessageCircle,
  Settings2,
  Check,
  RefreshCw,
  AlertCircle,
  RefreshCcw,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = [
  '#000000', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6',
  '#f97316', '#84cc16', '#0ea5e9', '#d946ef', '#64748b',
  '#475569', '#1e293b', '#7c3aed', '#db2777', '#2563eb',
  '#dc2626', '#16a34a', '#9333ea', '#c026d3'
];

const SOCIAL_PRESETS = [
  { 
    id: 'instagram', 
    icon: Instagram, 
    color: '#E1306C', 
    label: 'Instagram', 
    svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  },
  { 
    id: 'facebook', 
    icon: Facebook, 
    color: '#1877F2', 
    label: 'Facebook', 
    svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  },
  { 
    id: 'twitter', 
    icon: Twitter, 
    color: '#1DA1F2', 
    label: 'Twitter', 
    svg: <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  },
  { 
    id: 'youtube', 
    icon: Youtube, 
    color: '#FF0000', 
    label: 'YouTube', 
    svg: <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  },
  { 
    id: 'linkedin', 
    icon: Linkedin, 
    color: '#0077B5', 
    label: 'LinkedIn', 
    svg: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  },
  { 
    id: 'github', 
    icon: Github, 
    color: '#181717', 
    label: 'GitHub', 
    svg: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  },
  { 
    id: 'whatsapp', 
    icon: MessageCircle, 
    color: '#25D366', 
    label: 'WhatsApp', 
    svg: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.605 6.06L0 24l6.117-1.605a11.793 11.793 0 005.925 1.585h.005c6.637 0 12.032-5.396 12.035-12.03a11.77 11.77 0 00-3.417-8.467"/>
  },
  { 
    id: 'twitch', 
    icon: Share2, 
    color: '#9146FF', 
    label: 'Twitch', 
    svg: <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  },
  { 
    id: 'tiktok', 
    icon: Share2, 
    color: '#000000', 
    label: 'TikTok', 
    svg: <path d="M12.525.02c1.31-.032 2.612-.019 3.916-.03.027 1.41.568 2.775 1.532 3.768.977.99 2.32 1.572 3.735 1.611V9.41c-1.266-.014-2.467-.309-3.51-.83-.829-.413-1.538-.988-2.13-1.662V15.41c.013 3.712-2.514 7.068-6.1 8.143-4.62 1.394-9.348-2.1-9.348-6.709 0-3.114 2.32-5.852 5.412-6.111V14.57c-1.76.172-3.066 1.657-3.066 3.423 0 1.895 1.539 3.434 3.434 3.434 1.884 0 3.434-1.539 3.434-3.434V0h.003z"/>
  },
  { 
    id: 'website', 
    icon: Globe, 
    color: '#4B5563', 
    label: 'Website', 
    svg: <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-17.93c-3.309.467-6 3.158-6.467 6.467H8.533c.44-2.17 1.35-4.11 2.467-5.533V4.07zm2 0v1.463c1.117 1.423 2.027 3.363 2.467 5.533h3.933c-.467-3.309-3.158-6-6.467-6.467h.067zm-1 14.393c-1.117-1.423-2.027-3.363-2.467-5.533H5.533c.467 3.309 3.158 6 6.467 6.467v-1.463h-.067zm2 1.463c3.309-.467 6-3.158 6.467-6.467h-3.933c-.44 2.17-1.35 4.11-2.467 5.533v1.463h.067zM12 19.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
  },
];

const BG_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1',
  '#fee2e2', '#fef3c7', '#dcfce7', '#d1fae5', '#dbeafe',
  '#e0e7ff', '#f5f3ff', '#fae8ff', '#fce7f3', '#fff1f2'
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'qr' | 'barcode'>('qr');
  const [inputValue, setInputValue] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrText, setQrText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [selectedSocial, setSelectedSocial] = useState<string | null>(null);
  const [designMode, setDesignMode] = useState<'standard' | 'social-card'>('standard');
  const [isSocialDark, setIsSocialDark] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  const resetApp = () => {
    setInputValue('');
    setQrText('');
    setQrColor('#000000');
    setQrBgColor('#ffffff');
    setActiveTab('qr');
    setDesignMode('standard');
    setSelectedSocial(null);
    setIsSocialDark(false);
    if (barcodeRef.current) barcodeRef.current.innerHTML = '';
  };

  useEffect(() => {
    if (activeTab === 'barcode' && inputValue) {
      try {
        // Clear previous barcode
        if (barcodeRef.current) {
          barcodeRef.current.innerHTML = "";
        }
        JsBarcode(barcodeRef.current, inputValue, {
          format: "CODE128",
          lineColor: qrColor,
          background: qrBgColor,
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 16,
          margin: 10
        });
      } catch (e) {
        console.error("Barcode generation error", e);
      }
    }
  }, [activeTab, inputValue, qrColor, qrBgColor]);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    setIsGenerating(true);
    try {
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const options = {
        quality: 1,
        pixelRatio: 4, // Ultra high quality
        backgroundColor: activeTab === 'qr' && designMode === 'social-card' 
          ? (isSocialDark ? '#000000' : qrColor) 
          : qrBgColor,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      };

      const dataUrl = await toPng(qrRef.current, options);
      const link = document.createElement('a');
      link.download = `qr-pro-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSocialSelect = (id: string) => {
    if (selectedSocial === id) {
      setSelectedSocial(null);
      return;
    }
    setSelectedSocial(id);
    const preset = SOCIAL_PRESETS.find(p => p.id === id);
    if (preset) {
      setQrColor(preset.color);
      if (!inputValue || inputValue.startsWith('https://')) {
        const baseUrls: Record<string, string> = {
          instagram: 'https://instagram.com/',
          facebook: 'https://facebook.com/',
          twitter: 'https://twitter.com/',
          youtube: 'https://youtube.com/',
          linkedin: 'https://linkedin.com/in/',
          github: 'https://github.com/',
          whatsapp: 'https://wa.me/',
        };
        if (baseUrls[id]) setInputValue(baseUrls[id]);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-blue-200">
              <QrCode className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-tight">QR & Barcode</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Professional Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 mr-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider">24/7 Active</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 mr-2">
              <Check className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-wider">Quality Certified</span>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings"
              className={cn(
                "p-2 rounded-full transition-all",
                showSettings ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100 text-slate-500"
              )}
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                if (confirm('Reset all fields?')) {
                  setInputValue('');
                  setQrText('');
                  setSelectedSocial(null);
                  setQrColor('#000000');
                  setQrBgColor('#ffffff');
                }
              }}
              aria-label="Reset App"
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              title="Reset App"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('qr')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
              activeTab === 'qr' ? "bg-white shadow-md text-blue-600 scale-[1.02]" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <QrCode className="w-4 h-4" />
            QR CODE
          </button>
          <button
            onClick={() => setActiveTab('barcode')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
              activeTab === 'barcode' ? "bg-white shadow-md text-blue-600 scale-[1.02]" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Barcode className="w-4 h-4" />
            BARCODE
          </button>
        </div>

        {activeTab === 'qr' && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDesignMode('standard')}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                designMode === 'standard' ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
              )}
            >
              Standard
            </button>
            <button
              onClick={() => setDesignMode('social-card')}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                designMode === 'social-card' ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
              )}
            >
              Social Card
            </button>
          </div>
        )}

        {activeTab === 'qr' && designMode === 'social-card' && (
          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 rounded-xl">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dark Theme</span>
            <button
              onClick={() => setIsSocialDark(!isSocialDark)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                isSocialDark ? "bg-slate-900" : "bg-slate-300"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                isSocialDark ? "left-7" : "left-1"
              )} />
            </button>
          </div>
        )}

        {/* Input Section */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content Source</label>
              <span className="text-[10px] font-medium text-slate-300 italic">Auto-detects links</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={activeTab === 'qr' ? "https://example.com" : "123456789"}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
              />
              {inputValue && (
                <button 
                  onClick={() => setInputValue('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4 pt-2 border-t border-slate-50"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Label Text</label>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="Scan me!"
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Preview Section */}
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-[50px] blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <motion.div
              key={activeTab + inputValue + qrColor + qrBgColor + qrText + designMode + selectedSocial + isSocialDark}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-[48px] shadow-2xl border border-white/50 relative z-10 flex flex-col items-center",
                designMode === 'social-card' && activeTab === 'qr' ? "p-0 overflow-hidden w-[280px]" : "bg-white p-10 gap-6"
              )}
              ref={qrRef}
              style={{ backgroundColor: designMode === 'social-card' && activeTab === 'qr' ? (isSocialDark ? '#000000' : qrColor) : qrBgColor }}
            >
              {activeTab === 'qr' ? (
                designMode === 'social-card' ? (
                  <div className="w-full flex flex-col items-center">
                    {/* Header Section */}
                    <div className="w-full pt-8 pb-6 px-6 text-center text-white space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Follow us on</p>
                      <div className="flex items-center justify-center gap-2">
                        {selectedSocial && (
                          <svg 
                            viewBox="0 0 24 24" 
                            className="w-8 h-8 fill-white"
                          >
                            {SOCIAL_PRESETS.find(p => p.id === selectedSocial)?.svg}
                          </svg>
                        )}
                        <h2 className="text-2xl font-black lowercase tracking-tight">
                          {selectedSocial ? SOCIAL_PRESETS.find(p => p.id === selectedSocial)?.label : 'Social'}
                        </h2>
                      </div>
                    </div>
                    
                    {/* QR Code Section */}
                    <div className="w-full bg-white px-6 pt-6 pb-10 rounded-t-[40px] flex flex-col items-center gap-4">
                      <div className="p-2 bg-white rounded-2xl">
                        <QRCodeSVG
                          value={inputValue || 'https://google.com'}
                          size={180}
                          fgColor={isSocialDark ? '#000000' : qrColor}
                          bgColor="#ffffff"
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                      {qrText && (
                        <p className="font-black text-center text-sm tracking-tight" style={{ color: isSocialDark ? '#000000' : qrColor }}>
                          {qrText}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative p-2 rounded-2xl" style={{ backgroundColor: qrBgColor }}>
                      <QRCodeSVG
                        value={inputValue || 'https://google.com'}
                        size={200}
                        fgColor={qrColor}
                        bgColor={qrBgColor}
                        level="H"
                        includeMargin={false}
                      />
                      {selectedSocial && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-white p-1.5 rounded-xl shadow-lg border border-slate-100">
                            {React.createElement(SOCIAL_PRESETS.find(p => p.id === selectedSocial)?.icon || Globe, {
                              size: 28,
                              color: qrColor,
                              fill: 'white'
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {qrText && (
                      <p className="font-black text-center text-lg tracking-tight" style={{ color: qrColor }}>
                        {qrText}
                      </p>
                    )}
                  </>
                )
              ) : (
                <div className="flex flex-col items-center min-h-[140px] justify-center">
                  <svg ref={barcodeRef} className="max-w-full h-auto"></svg>
                  {!inputValue && (
                    <div className="text-center space-y-2">
                      <Barcode className="w-12 h-12 text-slate-200 mx-auto" />
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Awaiting Data</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Customization Section */}
        <section className="space-y-8 pb-12">
          {/* Social Presets */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Social Branding</span>
                </div>
                {selectedSocial && (
                  <button onClick={() => setSelectedSocial(null)} className="text-[10px] font-bold text-blue-600 uppercase">Clear</button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {SOCIAL_PRESETS.map((social) => (
                  <button
                    key={social.id}
                    onClick={() => handleSocialSelect(social.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-300",
                      selectedSocial === social.id 
                        ? "bg-white border-blue-500 shadow-xl shadow-blue-100 -translate-y-1" 
                        : "bg-white border-slate-50 hover:border-slate-200 hover:shadow-md"
                    )}
                  >
                    <div className="p-2 rounded-full bg-slate-50">
                      <social.icon className="w-5 h-5" style={{ color: social.color }} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{social.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Pickers */}
          <div className="grid grid-cols-1 gap-8">
            {/* Foreground Color */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 px-1">
                <Palette className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Primary Color</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setQrColor(color);
                      setSelectedSocial(null);
                    }}
                    className={cn(
                      "w-9 h-9 rounded-2xl border-2 transition-all flex items-center justify-center shadow-sm",
                      qrColor === color ? "border-slate-900 scale-110 rotate-3 shadow-md" : "border-white"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {qrColor === color && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 px-1">
                <div className="w-4 h-4 border-2 border-slate-200 rounded-sm" />
                <span className="text-xs font-bold uppercase tracking-wider">Background Theme</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {BG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setQrBgColor(color)}
                    className={cn(
                      "w-9 h-9 rounded-2xl border-2 transition-all flex items-center justify-center shadow-sm",
                      qrBgColor === color ? "border-blue-500 scale-110 -rotate-3 shadow-md" : "border-white"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {qrBgColor === color && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Download Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-30">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleDownload}
              disabled={!inputValue || isGenerating}
              className={cn(
                "w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95",
                !inputValue || isGenerating
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-black shadow-slate-300"
              )}
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isGenerating ? "Processing..." : "Export to Gallery"}
            </button>
          </div>
        </div>
        {/* Footer Info */}
        <footer className="px-6 py-12 text-center space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">System Online 24/7</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              <Check className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-wider">Offline Ready</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              <AlertCircle className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-wider">Privacy Verified</span>
            </div>
          </div>

          <div className="space-y-4 max-w-xs mx-auto">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">QR & Barcode Pro v1.0.0</p>
              <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                Compliant with Play Store & App Store safety standards. All data is processed locally on your device. No personal information is collected or transmitted.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 pt-2">
              <button 
                onClick={() => setShowPrivacy(true)}
                className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                Privacy Policy
              </button>
              <div className="w-1 h-1 bg-slate-200 rounded-full" />
              <button 
                onClick={() => setShowTerms(true)}
                className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                Terms of Use
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => {
                if (confirm('Clear all app data and reset?')) {
                  localStorage.clear();
                  resetApp();
                  window.location.reload();
                }
              }}
              aria-label="Factory Reset"
              className="flex items-center gap-2 mx-auto text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Factory Reset
            </button>
          </div>
        </footer>
      </main>
    </div>

    {/* Privacy Policy Modal */}
    <AnimatePresence>
      {showPrivacy && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPrivacy(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <RefreshCw className="w-5 h-5 rotate-45 text-slate-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">1. Data Collection</h3>
                <p>QR & Barcode Pro is an offline-first application. We do not collect, store, or transmit any personal data, QR code content, or barcode information to any external servers.</p>
              </section>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">2. Local Processing</h3>
                <p>All generation of QR codes and barcodes happens locally on your device. Your input data never leaves your hardware.</p>
              </section>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">3. Permissions</h3>
                <p>This app requires no sensitive permissions. Image saving is handled via standard browser download protocols to your device's gallery or downloads folder.</p>
              </section>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">4. Third Parties</h3>
                <p>Since no data is collected, no data is ever shared with third parties, advertisers, or analytics providers.</p>
              </section>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setShowPrivacy(false)}
                className="w-full py-3 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Terms of Use Modal */}
    <AnimatePresence>
      {showTerms && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowTerms(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Terms of Use</h2>
              <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <RefreshCw className="w-5 h-5 rotate-45 text-slate-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">1. Usage License</h3>
                <p>You are granted a non-exclusive license to use this tool for personal and professional purposes. You may generate and distribute QR codes and barcodes freely.</p>
              </section>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">2. User Responsibility</h3>
                <p>You are solely responsible for the content encoded in the QR codes and barcodes you generate. Ensure your content complies with local laws and regulations.</p>
              </section>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">3. Disclaimer</h3>
                <p>This software is provided "as is" without warranty of any kind. While we strive for 24/7 reliability, we are not liable for any issues arising from the use of generated codes.</p>
              </section>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">4. Professional Standards</h3>
                <p>This app is designed to meet professional quality standards for the Play Store and App Store.</p>
              </section>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setShowTerms(false)}
                className="w-full py-3 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs"
              >
                Accept & Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
