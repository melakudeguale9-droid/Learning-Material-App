import 'package:flutter/material.dart';

void main() {
  runApp(const LearningApp());
}

// ---------------- MODEL ----------------
class LearningMaterial {
  final String id;
  final String title;
  final String author;
  final String category;
  final double price;
  final String type; // 'Physical Book' or 'PDF / E-Book'
  final String description;
  final IconData icon;

  LearningMaterial({
    required this.id,
    required this.title,
    required this.author,
    required this.category,
    required this.price,
    required this.type,
    required this.description,
    required this.icon,
  });
}

// ---------------- MOCK DATA ----------------
final List<LearningMaterial> sampleMaterials = [
  LearningMaterial(
    id: '1',
    title: 'Grade 12 Physics & Exam Guide',
    author: 'Dr. Abebe T.',
    category: 'Science',
    price: 250.0,
    type: 'Physical Book',
    description:
        'Comprehensive physics formulas, exercises, and past exam questions with step-by-step solutions.',
    icon: Icons.menu_book,
  ),
  LearningMaterial(
    id: '2',
    title: 'Python Programming for Beginners',
    author: 'Sarah Jenkins',
    category: 'Computer Science',
    price: 180.0,
    type: 'PDF / E-Book',
    description:
        'Learn coding from scratch. Covers variables, data structures, OOP, and mini projects.',
    icon: Icons.picture_as_pdf,
  ),
  LearningMaterial(
    id: '3',
    title: 'University Calculus & Linear Algebra',
    author: 'Prof. Markos G.',
    category: 'Mathematics',
    price: 320.0,
    type: 'Physical Book',
    description:
        'Standard textbook for engineering and natural science freshman courses.',
    icon: Icons.calculate,
  ),
  LearningMaterial(
    id: '4',
    title: 'English Grammar & Writing Skills',
    author: 'Helen Brook',
    category: 'Languages',
    price: 150.0,
    type: 'PDF / E-Book',
    description:
        'Essential rules, essay templates, and vocabulary lists for students and professionals.',
    icon: Icons.language,
  ),
];

// ---------------- APP ROOT ----------------
class LearningApp extends StatelessWidget {
  const LearningApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Toby Learning Store',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const CatalogScreen(),
    );
  }
}

// ---------------- 1. HOME CATALOG SCREEN ----------------
class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  final List<LearningMaterial> cart = [];
  String searchQuery = '';
  String selectedCategory = 'All';

  final List<String> categories = [
    'All',
    'Science',
    'Mathematics',
    'Computer Science',
    'Languages',
  ];

  @override
  Widget build(BuildContext context) {
    final filteredMaterials = sampleMaterials.where((item) {
      final matchesSearch =
          item.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
          item.author.toLowerCase().contains(searchQuery.toLowerCase());
      final matchesCategory =
          selectedCategory == 'All' || item.category == selectedCategory;
      return matchesSearch && matchesCategory;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Learning Materials'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CartScreen(
                        cartItems: cart,
                        onRemove: (item) {
                          setState(() => cart.remove(item));
                        },
                      ),
                    ),
                  ).then((_) => setState(() {}));
                },
              ),
              if (cart.isNotEmpty)
                Positioned(
                  right: 8,
                  top: 8,
                  child: CircleAvatar(
                    radius: 9,
                    backgroundColor: Colors.red,
                    child: Text(
                      '${cart.length}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search books, subjects, authors...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              onChanged: (val) => setState(() => searchQuery = val),
            ),
          ),

          // Categories Filter
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: categories.map((cat) {
                final isSelected = selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (_) => setState(() => selectedCategory = cat),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 8),

          // Products List
          Expanded(
            child: filteredMaterials.isEmpty
                ? const Center(child: Text('No learning materials found.'))
                : ListView.builder(
                    itemCount: filteredMaterials.length,
                    itemBuilder: (context, index) {
                      final item = filteredMaterials[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: Colors.deepPurple.shade50,
                            child: Icon(item.icon, color: Colors.deepPurple),
                          ),
                          title: Text(
                            item.title,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text('${item.author} • ${item.type}'),
                          trailing: Text(
                            '${item.price.toStringAsFixed(0)} ETB',
                            style: const TextStyle(
                              color: Colors.green,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => DetailScreen(
                                  material: item,
                                  onAddToCart: () {
                                    setState(() => cart.add(item));
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          '${item.title} added to cart!',
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

// ---------------- 2. PRODUCT DETAILS SCREEN ----------------
class DetailScreen extends StatelessWidget {
  final LearningMaterial material;
  final VoidCallback onAddToCart;

  const DetailScreen({
    super.key,
    required this.material,
    required this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(material.title)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                height: 140,
                width: 140,
                decoration: BoxDecoration(
                  color: Colors.deepPurple.shade100,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(material.icon, size: 70, color: Colors.deepPurple),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              material.title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            Text(
              'By ${material.author}',
              style: TextStyle(color: Colors.grey.shade700, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Chip(label: Text(material.type)),
            const Divider(height: 30),
            const Text(
              'Description',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text(
              material.description,
              style: const TextStyle(fontSize: 15, height: 1.4),
            ),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${material.price.toStringAsFixed(0)} ETB',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  icon: const Icon(Icons.add_shopping_cart),
                  label: const Text('Add to Cart'),
                  onPressed: () {
                    onAddToCart();
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------- 3. CART & CHECKOUT SCREEN ----------------
class CartScreen extends StatefulWidget {
  final List<LearningMaterial> cartItems;
  final Function(LearningMaterial) onRemove;

  const CartScreen({
    super.key,
    required this.cartItems,
    required this.onRemove,
  });

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  @override
  Widget build(BuildContext context) {
    final double total = widget.cartItems.fold(
      0,
      (sum, item) => sum + item.price,
    );

    return Scaffold(
      appBar: AppBar(title: const Text('My Cart')),
      body: widget.cartItems.isEmpty
          ? const Center(child: Text('Your cart is empty.'))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: widget.cartItems.length,
                    itemBuilder: (context, index) {
                      final item = widget.cartItems[index];
                      return ListTile(
                        leading: Icon(item.icon, color: Colors.deepPurple),
                        title: Text(item.title),
                        subtitle: Text(
                          '${item.price.toStringAsFixed(0)} ETB (${item.type})',
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () {
                            widget.onRemove(item);
                            setState(() {});
                          },
                        ),
                      );
                    },
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total:',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '${total.toStringAsFixed(0)} ETB',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.deepPurple,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.all(14),
                          ),
                          child: const Text(
                            'Proceed to Payment',
                            style: TextStyle(fontSize: 16),
                          ),
                          onPressed: () => _showPaymentDialog(context),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  void _showPaymentDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select Payment Method',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              ListTile(
                leading: const Icon(Icons.phone_android, color: Colors.blue),
                title: const Text('Telebirr'),
                onTap: () => _completeOrder(context, 'Telebirr'),
              ),
              ListTile(
                leading: const Icon(Icons.account_balance, color: Colors.purple),
                title: const Text('CBE Birr'),
                onTap: () => _completeOrder(context, 'CBE Birr'),
              ),
              ListTile(
                leading: const Icon(Icons.credit_card, color: Colors.orange),
                title: const Text('Credit / Debit Card'),
                onTap: () => _completeOrder(context, 'Card'),
              ),
              ListTile(
                leading: const Icon(Icons.local_shipping, color: Colors.green),
                title: const Text('Cash on Delivery (Physical Books)'),
                onTap: () => _completeOrder(context, 'Cash on Delivery'),
              ),
            ],
          ),
        );
      },
    );
  }

  void _completeOrder(BuildContext context, String method) {
    Navigator.pop(context); // Close bottom sheet
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Order Placed!'),
        content: Text(
          'Payment via $method initiated. You will receive an SMS/Email receipt.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              setState(() => widget.cartItems.clear());
              Navigator.pop(context); // Return to catalog
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
