// // components/custom/HeroSection.tsx

// interface HeroSectionProps {
//   data: {
//     image: {
//       url: string;
//       alternativeText: string;
//     };
//     link: {
//       href: string;
//       label: string;
//     };
//   };
// }

// export function HeroSection({ data }: HeroSectionProps) {
//   return (
//     <section className="hero-section">
//       <div className="hero-image">
//         <img
//           src={data.image.url}
//           alt={data.image.alternativeText}
//           className="w-full h-auto"
//         />
//       </div>
//       <div className="hero-content">
//         <h1 className="hero-title">Welcome to Our Website</h1>
//         <p className="hero-description">
//           This is a hero section that can include some promotional content.
//         </p>
//         <a href={data.link.href} className="hero-link">
//           {data.link.label}
//         </a>
//       </div>
//     </section>
//   );
// }
