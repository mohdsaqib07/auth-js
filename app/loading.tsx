const LoadingSpinner = () => {
  return (
    <div className="flex w-screen min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 to-slate-950">
      {/* Your JSX code here */}
      <div className="border-white border-b-2 border-t-2 animate-spin w-12 h-12 rounded-full" />
    </div>
  );
};

export default LoadingSpinner;
