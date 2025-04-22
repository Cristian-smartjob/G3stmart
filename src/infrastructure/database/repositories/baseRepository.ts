export abstract class BaseRepository<T, K = number, CreateInput = unknown, UpdateInput = unknown> {
  protected abstract getModel(): PrismaModel<T, K, CreateInput, UpdateInput>;
  protected abstract getModelName(): string;

  async findAll(): Promise<T[]> {
    const model = this.getModel();
    return model.findMany();
  }

  async findById(id: K): Promise<T | null> {
    const model = this.getModel();
    return model.findUnique({
      where: { id },
    });
  }

  async create(data: CreateInput): Promise<T> {
    const model = this.getModel();
    return model.create({
      data,
    });
  }

  async update(id: K, data: UpdateInput): Promise<T> {
    const model = this.getModel();
    return model.update({
      where: { id },
      data,
    });
  }

  async delete(id: K): Promise<T> {
    const model = this.getModel();
    return model.delete({
      where: { id },
    });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    const model = this.getModel();
    return model.count({
      where,
    });
  }
}

interface PrismaModel<T, K, CreateInput, UpdateInput> {
  findMany(args?: { where?: Record<string, unknown>; include?: Record<string, boolean> }): Promise<T[]>;
  findUnique(args: { where: { id: K }; include?: Record<string, boolean> }): Promise<T | null>;
  create(args: { data: CreateInput; include?: Record<string, boolean> }): Promise<T>;
  update(args: { where: { id: K }; data: UpdateInput; include?: Record<string, boolean> }): Promise<T>;
  delete(args: { where: { id: K }; include?: Record<string, boolean> }): Promise<T>;
  count(args: { where?: Record<string, unknown> }): Promise<number>;
}
