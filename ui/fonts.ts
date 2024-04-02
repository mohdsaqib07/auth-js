import { Inter, Poppins } from 'next/font/google';

export const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '500', '700', '900'],
});

export const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '700','600'],
	style:['normal','italic']
});
