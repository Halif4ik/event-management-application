import { css } from '@emotion/css';
import { colors } from '../../styles';

export const btnStyles = (disabled: boolean): string => {
	return css`
		width: 100%;
		padding: 17px 0;
		font-size: 16px;
		font-weight: 500;
		color: ${disabled ? colors.white : colors.white};
		background-color: ${disabled
			? colors.ocean_blue
			: colors.medium_violet_red};
		border: none;
		border-radius: 12px;
		box-shadow: 0px 1px 1px rgba(255, 255, 255, 0.06);
		text-align: center;
		cursor: pointer;
		transition: background-color 0.2s ease;
		
		&:hover {
			background-color: ${disabled
				? colors.ocean_blue
				: '#5397F5'};
		}
	`;
};

export const btnContentWrapper = css`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const iconWrapper = css`
	display: flex;
	align-items: center;
`;

export const mr = css`
	margin-right: 15px;
`;
