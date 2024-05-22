import { Context } from "../pages/api/graphql";

export const resolvers = {
    Query: {
        orders: async (_: any, __: any, context: Context) => {
            return await context.prisma.order.findMany();
        },
        order: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.order.findUnique({
                where: { id: args.id },
            });
        },
        products: async (_: any, __: any, context: Context) => {
            return await context.prisma.product.findMany();
        },
        product: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.product.findUnique({
                where: { id: args.id },
            });
        },
        categories: async (_: any, __: any, context: Context) => {
            return await context.prisma.category.findMany();
        },
        category: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.category.findUnique({
                where: { id: args.id },
            });
        },
    },
    Mutation: {
        createOrders: async (_: any, args: any, context: Context) => {
            const { orders } = args;
            return await context.prisma.order.createMany({
                data: orders.map((order: any) => ({
                    totalAmount: order.totalAmount,
                    userId: order.userId,
                    orderItems: {
                        create: order.orderItems.map((item: any) => ({
                            quantity: item.quantity,
                            price: item.price,
                            productId: item.productId,
                        })),
                    },
                })),
            });
        },
        updateOrders: async (_: any, args: any, context: Context) => {
            const { orders } = args;
            const updatePromises = orders.map((order: any) =>
                context.prisma.order.update({
                    where: { id: order.id },
                    data: {
                        totalAmount: order.totalAmount,
                        orderItems: {
                            upsert: order.orderItems.map((item: any) => ({
                                where: { id: item.id },
                                update: {
                                    quantity: item.quantity,
                                    price: item.price,
                                },
                                create: {
                                    quantity: item.quantity,
                                    price: item.price,
                                    productId: item.productId,
                                },
                            })),
                        },
                    },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteOrders: async (_: any, args: { ids: number[] }, context: Context) => {
            const deletePromises = args.ids.map((id: number) =>
                context.prisma.order.delete({ where: { id } })
            );
            return await Promise.all(deletePromises);
        },

        createOrderItems: async (_: any, args: any, context: Context) => {
            const { orderItems } = args;
            return await context.prisma.orderItem.createMany({
                data: orderItems.map((item: any) => ({
                    quantity: item.quantity,
                    price: item.price,
                    orderId: item.orderId,
                    productId: item.productId,
                })),
            });
        },
        updateOrderItems: async (_: any, args: any, context: Context) => {
            const { orderItems } = args;
            const updatePromises = orderItems.map((item: any) =>
                context.prisma.orderItem.update({
                    where: { id: item.id },
                    data: {
                        quantity: item.quantity,
                        price: item.price,
                    },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteOrderItems: async (_: any, args: { ids: number[] }, context: Context) => {
            const deletePromises = args.ids.map((id: number) =>
                context.prisma.orderItem.delete({ where: { id } })
            );
            return await Promise.all(deletePromises);
        },

        createProducts: async (_: any, args: any, context: Context) => {
            const { products } = args;
            return await context.prisma.product.createMany({
                data: products.map((product: any) => ({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    categoryId: product.categoryId,
                })),
            });
        },
        updateProducts: async (_: any, args: any, context: Context) => {
            const { products } = args;
            const updatePromises = products.map((product: any) =>
                context.prisma.product.update({
                    where: { id: product.id },
                    data: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        categoryId: product.categoryId,
                    },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteProducts: async (_: any, args: { ids: number[] }, context: Context) => {
            const deletePromises = args.ids.map((id: number) =>
                context.prisma.product.delete({ where: { id } })
            );
            return await Promise.all(deletePromises);
        },

        createCategories: async (_: any, args: any, context: Context) => {
            const { categories } = args;
            return await context.prisma.category.createMany({
                data: categories.map((category: any) => ({
                    name: category.name,
                })),
            });
        },
        updateCategories: async (_: any, args: any, context: Context) => {
            const { categories } = args;
            const updatePromises = categories.map((category: any) =>
                context.prisma.category.update({
                    where: { id: category.id },
                    data: {
                        name: category.name,
                    },
                })
            );
            return await Promise.all(updatePromises);
        },
        deleteCategories: async (_: any, args: { ids: number[] }, context: Context) => {
            const deletePromises = args.ids.map((id: number) =>
                context.prisma.category.delete({ where: { id } })
            );
            return await Promise.all(deletePromises);
        },
    },
    Order: {
        orderItems: async (parent: any, _: any, context: Context) => {
            return await context.prisma.orderItem.findMany({ where: { orderId: parent.id } });
        },
    },
    OrderItem: {
        order: async (parent: any, _: any, context: Context) => {
            return await context.prisma.order.findUnique({ where: { id: parent.orderId } });
        },
        product: async (parent: any, _: any, context: Context) => {
            return await context.prisma.product.findUnique({ where: { id: parent.productId } });
        },
    },
    Product: {
        category: async (parent: any, _: any, context: Context) => {
            return await context.prisma.category.findUnique({ where: { id: parent.categoryId } });
        },
        orderItems: async (parent: any, _: any, context: Context) => {
            return await context.prisma.orderItem.findMany({ where: { productId: parent.id } });
        },
    },
    Category: {
        products: async (parent: any, _: any, context: Context) => {
            return await context.prisma.product.findMany({ where: { categoryId: parent.id } });
        },
    },
};
