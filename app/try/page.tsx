export default function TryPage() {
    return (
      <main className="min-h-screen bg-gray-100">
        <header className="bg-white shadow px-8 py-5">
          <h1 className="text-3xl font-bold text-emerald-700">
            WebAIGenAcademy Lab
          </h1>
  
          <p className="text-gray-600 mt-1">
            Testing lesson notebooks with JupyterLite
          </p>
        </header>
  
        <div className="p-6 space-y-4">
          <div className="bg-white border rounded-xl p-5">
            <h2 className="text-xl font-bold mb-2">
              Lesson 1: Machine Learning Introduction
            </h2>
  
            <p className="text-gray-600 mb-4">
              This lesson includes starter code and comments for students to complete.
            </p>
  
            <a
              href="/lessons/ml-introduction.ipynb"
              download
              className="inline-block bg-emerald-600 text-white px-5 py-2 rounded hover:bg-emerald-700"
            >
              Download Starter Notebook
            </a>
          </div>
  
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
          {/* <iframe
  src="/jupyterlite/lab/index.html"

/> */}
<iframe
    src="/jupyterlite/lab/index.html?path=lessons/ml-introduction.ipynb"
  title="WebAIGenAcademy JupyterLite"
  className="w-full h-[85vh]"
/>
          </div>
        </div>
      </main>
    );
  }