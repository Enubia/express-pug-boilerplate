/* eslint-disable import/no-extraneous-dependencies */
import { assert } from 'chai';
import { describe, it } from 'mocha';

describe('#dummy', () => {
	it('should calculate 1 + 2', () => {
		const a = 1;
		const b = 2;

		assert.strictEqual(3, a + b);
	});
});
