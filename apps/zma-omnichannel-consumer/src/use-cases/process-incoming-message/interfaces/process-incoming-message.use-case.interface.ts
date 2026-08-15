export interface ProcessIncomingMessageUseCase {
  execute(data: any): Promise<void>;
}
