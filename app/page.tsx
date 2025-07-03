import OverviewTasks from "@/components/task/OverviewTasks";


export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Todoapp</h1>
      <OverviewTasks/>
    </div>
  );
}
