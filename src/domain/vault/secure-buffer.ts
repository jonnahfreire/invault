export class SecureBuffer {
  private buffer: Buffer;
  private destroyed = false;

  private constructor(buf: Buffer) {
    this.buffer = buf;
  }

  static alloc(size: number): SecureBuffer {
    return new SecureBuffer(Buffer.alloc(size));
  }

  static from(data: Buffer | Uint8Array): SecureBuffer {
    const buf = Buffer.alloc(data.length);
    Buffer.from(data).copy(buf);
    return new SecureBuffer(buf);
  }

  get value(): Buffer {
    if (this.destroyed) {
      throw new Error("SecureBuffer destroyed");
    }
    return this.buffer;
  }

  destroy(): void {
    if (!this.destroyed) {
      this.buffer.fill(0);
      this.destroyed = true;
    }
  }
}
