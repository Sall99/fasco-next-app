import { Hero, Logos, NewArrivals, Feature } from "@/components";

export default function Home() {
  return (
    <div>
      <Hero />
      <Logos />
      {/* <MonthDeals /> */}
      <NewArrivals />
      <Feature />
    </div>
  );
}
