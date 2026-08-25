let idSequence = 0;

export class UniqueId {
  public static generate(prefix = 'gp_id_'): string {
    idSequence += 1;
    return `${prefix}${idSequence}_${Math.random().toString(36).substring(2, 7)}`;
  }
}
