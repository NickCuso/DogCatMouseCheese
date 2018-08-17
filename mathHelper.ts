import { Vector3Component } from 'metaverse-api';
const aStar = require('a-star'); // TODO import work?

export function add(a: Vector3Component, b: Vector3Component): Vector3Component
{
	return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subtract(a: Vector3Component, b: Vector3Component): Vector3Component
{
	return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function lengthSquared(a: Vector3Component): number
{
	return a.x * a.x + a.y * a.y + a.z * a.z;
}

export function isZero(a: Vector3Component): boolean
{
	return a.x == 0 && a.y == 0 && a.z == 0;
}

export function equals(a: Vector3Component, b: Vector3Component): boolean
{
	return a.x == b.x && a.y == b.y && a.z == b.z;
}

export function approxEquals(a: Vector3Component, b: Vector3Component): boolean
{
	return a.x - b.x < 1 && a.y - b.y < 1 && a.z - b.z < 1;
}

export function round(a: Vector3Component): Vector3Component
{
	return { x: Math.round(a.x), y: Math.round(a.y), z: Math.round(a.z) };
}

export function calcPath(startingPosition: Vector3Component, targetPosition: Vector3Component,
	isValidPosition: (position: Vector3Component) => boolean): Vector3Component[]
{
	targetPosition = round(targetPosition);
	const results = aStar({
		start: round(startingPosition),
		isEnd: (n: Vector3Component): boolean =>
		{
			return equals(n, targetPosition);
		},
		neighbor: (x: Vector3Component): Vector3Component[] =>
		{
			return getNeighbors(x, isValidPosition);
		},
		distance: (a: Vector3Component, b: Vector3Component): number =>
		{
			return lengthSquared(subtract(a, b));
		},
		heuristic: (x: Vector3Component): number =>
		{
			return lengthSquared(subtract(x, targetPosition));
		},
		hash: (x: Vector3Component): string =>
		{
			return JSON.stringify(x);
		},
	});

	// TODO deal with failed path
	return results.path;
}

function getNeighbors(startingPosition: Vector3Component,
	isValidPosition: (position: Vector3Component) => boolean): Vector3Component[]
{
	let neighbors: Vector3Component[] = [];

	for (const neighborDirection of [
		{ x: 1, y: 0, z: 0 },
		{ x: -1, y: 0, z: 0 },
		{ x: 0, y: 0, z: 1 },
		{ x: 0, y: 0, z: -1 },

		//{ x: 1, y: 0, z: 1 },
		//{ x: -1, y: 0, z: -1 },
		//{ x: -1, y: 0, z: 1 },
		//{ x: 1, y: 0, z: -1 },
	])
	{
		let position = add(startingPosition, neighborDirection);
		if (!isValidPosition(position))
		{
			continue;
		}
		neighbors.push(position);
	}

	return neighbors;
}

export function inSphere(position: Vector3Component, target: Vector3Component, radius: number): boolean
{
	const delta = subtract(target, position);
	return lengthSquared(delta) <= radius * radius;
}

export function div(a: Vector3Component, b: number): Vector3Component
{
	return { x: a.x / b, y: a.y / b, z: a.z / b };
}