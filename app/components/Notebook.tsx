// components/Notebook.tsx

type NotebookProps = {
    notebook: string;
  };
  
  export default function Notebook({ notebook }: NotebookProps) {
    return (
      <iframe
        src={`/jupyterlite/lab/index.html?path=${notebook}`}
        title="WebAIGenAcademy Notebook"
        className="w-full h-[85vh] rounded-xl "
      />
    );
  }