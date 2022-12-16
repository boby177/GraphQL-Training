import { Task } from "../entities/Task";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class TaskResolver {
  @Query(() => String)
  hello(): string {
    return "Hello World";
  }

  @Query(() => [Task])
  tasks(): Promise<Task[]> {
    return Task.find({});
  }

  @Query(() => Task, { nullable: true })
  task(
    @Arg("id", () => Int)
    id: number
  ): Promise<Task | null> {
    return Task.findOne({ where: { id } });
  }

  @Mutation(() => Task)
  createTask(
    @Arg("title", () => String)
    title: string
  ): Promise<Task> {
    return Task.create({ title, isCompleted: false }).save();
  }

  @Mutation(() => Boolean)
  deleteTasks(
    @Arg("id", () => Int)
    id: number
  ) {
    try {
      Task.delete({ id });
      return true;
    } catch {
      return false;
    }
  }

  @Mutation(() => Boolean, { nullable: true })
  updateTask(
    @Arg("id", () => Int)
    id: number,

    @Arg("isCompleted", () => Boolean)
    isCompleted: boolean
  ): boolean | null {
    const task = Task.findOne({ where: { id } });
    if (!task) {
      return null;
    }

    try {
      Task.update({ id }, { isCompleted });
      return true;
    } catch {
      return false;
    }
  }
}
