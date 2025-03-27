import { PricingCard } from '@components/princing-card';
import {
	Calendar,
	GraduationCap,
	Send,
	Headphones,
	Search,
	Trophy,
	Target,
} from 'lucide-react';

const plans = [
	{
		name: 'Start',
		price: 397,
		description:
			'Ideal para afiliados iniciantes que querem começar a vender!',
		users: '01 Usuário',
		features: [
			{ text: 'Sistema de envio de nomes', icon: Send },
			{ text: 'Treinamento - Academia de negócios', icon: GraduationCap },
		],
		color: 'bg-gray-100 hover:bg-gray-200',
		textColor: 'text-gray-800',
	},
	{
		name: 'Professional',
		price: 797,
		description: 'Plano para afiliados que estão em busca de crescimento.',
		users: '03 Usuários',
		features: [
			{ text: 'Sistema de envio de nomes', icon: Send },
			{ text: 'Treinamento - Academia de negócios', icon: GraduationCap },
			{ text: 'Agenda', icon: Calendar },
			{ text: 'Apollo Atende', icon: Headphones },
			{ text: 'Pesquisa em tempo real', icon: Search },
			{ text: 'Ranking', icon: Trophy },
			{ text: 'Conquista', icon: Target },
		],
		color: 'bg-amber-50 hover:bg-amber-100',
		textColor: 'text-gray-800',
		popular: true,
	},
	{
		name: 'Enterprise',
		price: 1297,
		description:
			'Ideal para empresas que buscam a construção de um império',
		users: '15 Usuários',
		features: [
			{ text: 'Sistema de envio de nomes', icon: Send },
			{ text: 'Treinamento - Academia de negócios', icon: GraduationCap },
			{ text: 'Agenda', icon: Calendar },
			{ text: 'Apollo Atende', icon: Headphones },
			{ text: 'Pesquisa em tempo real', icon: Search },
			{ text: 'Ranking', icon: Trophy },
			{ text: 'Conquista', icon: Target },
		],
		color: 'bg-gray-900 hover:bg-black',
		textColor: 'text-white',
	},
];

export default function Pricing() {
	return (
		<section className="bg-gradient-to-br from-gray-50 to-white">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
				<div className="my-10 text-center">
					<h2 className="mb-6 text-4xl font-bold text-gray-800">
						Escolha o Plano Ideal
					</h2>
					<p className="mx-auto max-w-3xl text-xl text-gray-600">
						Soluções flexíveis para impulsionar seu crescimento como
						afiliado
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{plans.map((plan) => (
						<PricingCard
							key={plan.name}
							plan={plan}
							onSelect={() => {}}
						/>
					))}
				</div>
			</div>
		</section>
	);
};