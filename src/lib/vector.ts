export class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another vector to this vector.
   * @param other The other vector to add.
   * @returns A new Vector2D representing the sum.
   */
  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtracts another vector from this vector.
   * @param other The other vector to subtract.
   * @returns A new Vector2D representing the difference.
   */
  subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiplies this vector by a scalar.
   * @param scalar The scalar to multiply by.
   * @returns A new Vector2D representing the scaled vector.
   */
  multiplyScalar(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * Divides this vector by a scalar.
   * @param scalar The scalar to divide by.
   * @returns A new Vector2D representing the scaled vector.
   * @throws Error if scalar is zero.
   */
  divideScalar(scalar: number): Vector2D {
    if (scalar === 0) {
      throw new Error("Cannot divide by zero.");
    }
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  /**
   * Calculates the magnitude (length) of this vector.
   * @returns The magnitude of the vector.
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns a new vector with the same direction as this vector but with a magnitude of 1.
   * @returns A new normalized Vector2D.
   * @throws Error if the vector has zero magnitude.
   */
  normalize(): Vector2D {
    const mag = this.magnitude();
    if (mag === 0) {
      throw new Error("Cannot normalize a zero vector.");
    }
    return new Vector2D(this.x / mag, this.y / mag);
  }

  /**
   * Calculates the dot product of this vector and another vector.
   * @param other The other vector.
   * @returns The dot product.
   */
  dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Calculates the distance between this vector and another vector.
   * @param other The other vector.
   * @returns The distance between the two vectors.
   */
  distanceTo(other: Vector2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the vector's x and y coordinates as a tuple.
   * @returns A tuple [x, y]
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }
}
