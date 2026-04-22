// // ── QR SHOW ────────────────────────────────────────────────────────────────────
// export function QRShow({ navigate, card }) {
//   const handleDownload = () => {
//     const a      = document.createElement('a');
//     a.href       = card.qr_code;
//     a.download   = `qr-${card.name.replace(/\s+/g, '-').toLowerCase()}.png`;
//     a.click();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
//         {/* Top accent bar */}
//         <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #1565c0, #42a5f5)' }} />

//         <div className="px-6 py-8 flex flex-col items-center text-center">
//           {/* Success badge */}
//           <div
//             className="w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg"
//             style={{ background: 'linear-gradient(135deg, #1565c0, #42a5f5)' }}
//           >
//             <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
//               <polyline points="20 6 9 17 4 12" />
//             </svg>
//           </div>

//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Card Created!</h2>
//           <p className="text-sm text-gray-500 mb-6 leading-relaxed">
//             Your QR code is ready. Share it or let people scan it to view your digital card.
//           </p>

//           {/* QR Code */}
//           <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-5 inline-block shadow-inner">
//             <img
//               src={card.qr_code}
//               alt="QR Code"
//               className="w-52 h-52 object-contain"
//             />
//           </div>

//           {/* Name & designation */}
//           <p className="text-lg font-bold text-gray-900 mb-0.5">{card.name}</p>
//           {card.designation && (
//             <p className="text-sm text-gray-500 mb-1">{card.designation}</p>
//           )}
//           {card.company && (
//             <p className="text-xs text-gray-400 mb-5">{card.company}</p>
//           )}
//           {!card.designation && !card.company && <div className="mb-5" />}

//           {/* Action buttons */}
//           <div className="flex gap-3 w-full">
//             <button
//               onClick={handleDownload}
//               className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors active:scale-95"
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//                 <polyline points="7 10 12 15 17 10" />
//                 <line x1="12" y1="15" x2="12" y2="3" />
//               </svg>
//               Download
//             </button>
//             <button
//               onClick={() => navigate('home')}
//               className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
//               style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)' }}
//             >
//               Go Home
//             </button>
//           </div>

//           {/* Share hint */}
//           <p className="text-xs text-gray-400 mt-4">
//             💡 Save and share your QR code anywhere
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }