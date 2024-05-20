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
        createOrder: async (_: any, args: any, context: Context) => {
            const { totalAmount, orderItems } = args;
            return await context.prisma.order.create({
                data: {
                    totalAmount,
                    orderItems: {
                        create: orderItems.map((item: any) => ({
                            quantity: item.quantity,
                            price: item.price,
                            product: { connect: { id: item.productId } },
                        })),
                    },
                },
            });
        },
        updateOrder: async (_: any, args: any, context: Context) => {
            const { id, totalAmount, orderItems } = args;
            return await context.prisma.order.update({
                where: { id },
                data: {
                    totalAmount,
                    orderItems: {
                        upsert: orderItems.map((item: any) => ({
                            where: { id: item.id },
                            update: {
                                quantity: item.quantity,
                                price: item.price,
                            },
                            create: {
                                quantity: item.quantity,
                                price: item.price,
                                product: { connect: { id: item.productId } },
                            },
                        })),
                    },
                },
            });
        },
        deleteOrder: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.order.delete({
                where: { id: args.id },
            });
        },

        createOrderItem: async (_: any, args: any, context: Context) => {
            const { quantity, price, orderId, productId } = args;
            return await context.prisma.orderItem.create({
                data: {
                    quantity,
                    price,
                    order: { connect: { id: orderId } },
                    product: { connect: { id: productId } },
                },
            });
        },
        updateOrderItem: async (_: any, args: any, context: Context) => {
            const { id, quantity, price } = args;
            return await context.prisma.orderItem.update({
                where: { id },
                data: {
                    quantity,
                    price,
                },
            });
        },
        deleteOrderItem: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.orderItem.delete({
                where: { id: args.id },
            });
        },

        createProduct: async (_: any, args: any, context: Context) => {
            const { name, description, price, stock, categoryId } = args;
            return await context.prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    stock,
                    category: { connect: { id: categoryId } },
                },
            });
        },
        updateProduct: async (_: any, args: any, context: Context) => {
            const { id, name, description, price, stock, categoryId } = args;
            return await context.prisma.product.update({
                where: { id },
                data: {
                    name,
                    description,
                    price,
                    stock,
                    category: { connect: { id: categoryId } },
                },
            });
        },
        deleteProduct: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.product.delete({
                where: { id: args.id },
            });
        },

        createCategory: async (_: any, args: any, context: Context) => {
            const { name } = args;
            return await context.prisma.category.create({
                data: {
                    name,
                },
            });
        },
        updateCategory: async (_: any, args: any, context: Context) => {
            const { id, name } = args;
            return await context.prisma.category.update({
                where: { id },
                data: {
                    name,
                },
            });
        },
        deleteCategory: async (_: any, args: { id: number }, context: Context) => {
            return await context.prisma.category.delete({
                where: { id: args.id },
            });
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
