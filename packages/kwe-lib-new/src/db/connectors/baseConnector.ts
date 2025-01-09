export abstract class DBConnector {
  static connectors: DBConnector[] = []; // 등록된 커넥터 관리

  constructor() {
    DBConnector.connectors.push(this); // 모든 인스턴스를 중앙에서 관리
  }

  abstract connect(): Promise<void>;
  abstract query<T>(sql: string, params?: any[]): Promise<T>;
  abstract disconnect(): Promise<void>;

  // 종료 시 연결 해제 처리
  static async cleanup(): Promise<void> {
    for (const connector of DBConnector.connectors) {
      try {
        await connector.disconnect();
        console.log(`${connector.constructor.name} disconnected successfully`);
      } catch (err) {
        console.error(`Error disconnecting ${connector.constructor.name}:`, err);
      }
    }
  }
}

// 애플리케이션 종료 이벤트 등록
process.on('exit', async () => {
  await DBConnector.cleanup();
});
process.on('SIGINT', async () => {
  await DBConnector.cleanup();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await DBConnector.cleanup();
  process.exit(0);
});
