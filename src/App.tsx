import PomodoroTimer from "./components/shared/pomodoro-timer";
import RootLayout from "./layouts/root-layout";

const App = () => {
  return (
    <RootLayout>
      <main className="flex items-center justify-center min-h-screen w-full mx-auto">
        <PomodoroTimer />
      </main>
    </RootLayout>
  );
};

export default App;
