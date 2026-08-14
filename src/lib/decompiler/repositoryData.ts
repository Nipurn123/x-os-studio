import rawTree from "./fullRepoTree.json";

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  language?: string;
  category: string;
  impactLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "SHIELD";
  weightOrValue?: string;
  oneLineSummary: string;
  codeSnippet: string;
  humanTranslation: {
    inSimpleTerms: string;
    whyThisExists: string;
    howItAffectsYourReach: string;
    theGoldenRule: string;
  };
  children?: FileNode[];
}

export const REPOSITORY_TREE: FileNode[] = rawTree as unknown as FileNode[];

// Helper to flatten tree for fast search across all 2000+ files
export function getAllFiles(nodes: FileNode[]): FileNode[] {
  const result: FileNode[] = [];
  function traverse(n: FileNode) {
    result.push(n);
    if (n.children && n.children.length > 0) {
      for (const c of n.children) {
        traverse(c);
      }
    }
  }
  for (const n of nodes) {
    traverse(n);
  }
  return result;
}
