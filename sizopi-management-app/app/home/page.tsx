import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Welcome to Sizopi!</h1>
      <Image
        src="/daiga-ellaby-Sg_OwwU2Z9o-unsplash.jpg"
        alt="Animal Picture"
        width={500}
        height={300}
        className="rounded-xl shadow-lg"
        />
    </div>
  );
}
