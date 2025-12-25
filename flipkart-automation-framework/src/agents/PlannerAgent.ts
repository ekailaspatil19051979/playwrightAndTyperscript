// PlannerAgent: Responsible for planning and decomposing tasks
export class PlannerAgent {
  planTask(taskDescription: string): string[] {
    // Example: Decompose a task into subtasks
    // In a real implementation, this could use AI or rules
    return [`Subtask for: ${taskDescription}`];
  }
}
