'use client';
import React from 'react';
import { PlusIcon, ShieldCheckIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './border-trail';
import SubscriptionButton from '@/components/subscription/SubscriptionButton';

export function PricingCard() {
	return (
		<div className="space-y-5">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
				viewport={{ once: true }}
				className="mx-auto max-w-xl space-y-5"
			>
				<div className="flex justify-center">
					<div className="rounded-lg border px-4 py-1 font-mono">Pricing</div>
				</div>
				<h2 className="mt-5 text-center text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
					Complete Your Journey
				</h2>
				<p className="text-muted-foreground mt-5 text-center text-sm md:text-base">
					Unlock wellness tracking and community access
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
				viewport={{ once: true }}
				className="space-y-4"
			>	
				{/* Monthly Plan */}
				<div className="relative border border-primary/20 rounded-lg p-6">
					<PlusIcon className="absolute -top-3 -left-3 size-5.5" />
					<PlusIcon className="absolute -top-3 -right-3 size-5.5" />
					<PlusIcon className="absolute -bottom-3 -left-3 size-5.5" />
					<PlusIcon className="absolute -right-3 -bottom-3 size-5.5" />

					<div className="text-center mb-4">
						<div className="flex items-center justify-center mb-2">
							<Badge variant="secondary">Popular</Badge>
						</div>
						<h3 className="text-lg font-semibold">Monthly Access</h3>
						<div className="text-3xl font-bold text-primary mt-2">$14.99<span className="text-base font-normal">/month</span></div>
					</div>
					
					<div className="space-y-3 mb-6">
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Access to workout library & healthy recipes</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Progress tracking & analytics</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Access to dedicated Wellness Coach</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Calorie checker</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Personalized nutrition plans</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Community support</span>
						</div>
					</div>
					
					<SubscriptionButton 
						variant="default" 
						size="lg" 
						className="w-full rounded-full"
						plan="monthly"
					>
						Start Your Journey
					</SubscriptionButton>
				</div>

				{/* Yearly Plan */}
				<div className="relative border-2 border-green-500/30 bg-green-50/30 rounded-lg p-6">
					<BorderTrail
						style={{
							boxShadow:
								'0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
						}}
						size={100}
					/>

					<div className="text-center mb-4">
						<div className="bg-green-500 text-white px-2 py-1 text-xs rounded-full mb-2 inline-block">
							BEST VALUE
						</div>
						<h3 className="text-lg font-semibold">Yearly Access</h3>
						<div className="text-3xl font-bold text-primary mt-2">$119.99<span className="text-base font-normal">/year</span></div>
						<div className="text-sm text-green-600 font-medium">Save $60 per year!</div>
					</div>
					
					<div className="space-y-3 mb-6">
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Access to workout library & healthy recipes</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Progress tracking & analytics</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Access to dedicated Wellness Coach</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Calorie checker</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Personalized nutrition plans</span>
						</div>
						<div className="flex items-center">
							<Check className="h-4 w-4 text-green-500 mr-3" />
							<span className="text-sm">Community support</span>
						</div>
					</div>
					
					<SubscriptionButton 
						variant="default" 
						size="lg" 
						className="w-full rounded-full bg-green-600 hover:bg-green-700"
						plan="yearly"
					>
						Get Started Now
					</SubscriptionButton>
				</div>

				<div className="text-muted-foreground flex items-center justify-center gap-x-2 text-sm">
					<ShieldCheckIcon className="size-4" />
					<span>Access to all features with no hidden fees</span>
				</div>
			</motion.div>
		</div>
	);
}