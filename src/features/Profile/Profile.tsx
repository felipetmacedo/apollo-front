import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/stores/user.store"
import { z } from "zod"
import { updateUser, type UpdateUserPayload } from '@/processes/user'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Subscription } from "./Subscription"
import { useQuery } from "@tanstack/react-query"
import { getPayments } from "@/processes/payments"

const updateProfileSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional()
}).refine((data) => {
    if (data.oldPassword) {
        return data.newPassword && data.confirmNewPassword
    }
    return true
}, {
    message: "You must fill in all password fields",
    path: ["newPassword"]
}).refine((data) => {
    if (data.newPassword) {
        return data.newPassword === data.confirmNewPassword
    }
    return true
}, {
    message: "Passwords must match",
    path: ["confirmNewPassword"]
})

type FormData = z.infer<typeof updateProfileSchema>

export function Profile() {
    const userInfo = useUserStore((state) => state.userInfo)

    const { data: payments } = useQuery({
        queryKey: ['payments'],
        queryFn: () => getPayments()
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: userInfo?.name,
            email: userInfo?.email,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    })

    const getInitials = (name: string | undefined) => {
        if (!name) return "??";
        const words = name.split(" ");
        const firstInitial = words[0]?.charAt(0) || "";
        const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0) : "";
        return (firstInitial + lastInitial).toUpperCase();
    };

    const onSubmit = async (data: FormData) => {
        try {
            const payload: Partial<UpdateUserPayload> = {};

            if (data.name !== userInfo?.name) payload.name = data.name;
            if (data.email !== userInfo?.email) payload.email = data.email;


            if (data.oldPassword) {
                payload.oldPassword = data.oldPassword;
                payload.newPassword = data.newPassword;
                payload.confirmNewPassword = data.confirmNewPassword;
            }

            if (Object.keys(payload).length === 0) {
                toast.info("No changes detected");
                return;
            }

            if (!userInfo?.id) {
                toast.error("User ID not found");
                return;
            }

            await updateUser(userInfo.id, payload);

            toast.success("Profile updated successfully!");

            reset({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            }, { keepValues: true });

        } catch {
            toast.error("Error updating profile");
        }
    };

    return (
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            <div className="p-6 w-full">
                <h1 className="text-2xl font-bold mb-6">Profile</h1>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage src="" alt="Avatar" />
                                            <AvatarFallback>
                                                {getInitials(userInfo?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium">Your avatar</h3>
                                            <p className="text-sm text-muted-foreground">
                                                PNG or JPG less than 500px in width and height.
                                            </p>
                                        </div>
                                        <Button type="button" variant="secondary">Add</Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input {...register("name")} />
                                            {errors.name && (
                                                <span className="text-sm text-red-500">{errors.name.message}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input {...register("email")} type="email" />
                                            {errors.email && (
                                                <span className="text-sm text-red-500">{errors.email.message}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="oldPassword">Current Password</Label>
                                            <Input {...register("oldPassword")} type="password" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input {...register("newPassword")} type="password" />
                                            {errors.newPassword && (
                                                <span className="text-sm text-red-500">{errors.newPassword.message}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                            <Input {...register("confirmNewPassword")} type="password" />
                                            {errors.confirmNewPassword && (
                                                <span className="text-sm text-red-500">{errors.confirmNewPassword.message}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Saving..." : "Save changes"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="subscriptions" className="space-y-6">
                        <Subscription billingHistory={payments} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
