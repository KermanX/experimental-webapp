use swc_core::{
    common::Span,
    ecma::{
        ast::{CallExpr, Expr, ExprOrSpread, Ident, Lit, MemberExpr, MemberProp, Null, Program},
        transforms::testing::test,
        visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
    },
};

use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use swc_ecma_parser::Syntax::Typescript;

pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        e.visit_mut_children_with(self);
        if let Some(callee_expr) = e.callee.as_mut_expr() {
            if let Some(member_expr) = callee_expr.as_mut_member() {
                //  if member_expr.obj is exactly `bc`
                if let Some(ident) = member_expr.obj.as_ident() {
                    if ident.sym != *"_" {
                        return;
                    }
                    let ident_span = ident.span.clone();
                    member_expr.obj = Box::new(Expr::Member(MemberExpr {
                        obj: member_expr.obj.clone(),
                        prop: MemberProp::Ident(Ident::new("$".into(), ident.span)),
                        span: member_expr.span,
                    }));
                    let mut add_null_param = || {
                        e.args.insert(
                            0,
                            ExprOrSpread {
                                expr: Box::new(Expr::Lit(Lit::Null(Null {
                                    span: Span::new(
                                        ident_span.hi.clone(),
                                        ident_span.hi.clone(),
                                        ident_span.ctxt.clone(),
                                    ),
                                }))),
                                spread: None,
                            },
                        );
                    };
                    if let Some(type_args_box) = &e.type_args {
                        let type_args = type_args_box.as_ref();
                        if type_args.params.len() > 1 {
                            panic!("Expected 0 or 1 type arg, got {}", type_args.params.len());
                        }
                        if type_args.params.is_empty() {
                            add_null_param();
                        } else if let Some(lit) = type_args.params[0].as_ts_lit_type() {
                            if let Some(str) = lit.lit.as_str() {
                                e.args.insert(
                                    0,
                                    ExprOrSpread {
                                        expr: Box::new(Expr::Lit(Lit::Str(str.clone()))),
                                        spread: None,
                                    },
                                );
                            } else {
                                panic!("Expected string literal, got {:?}", lit.lit);
                            }
                        }
                    } else {
                        add_null_param();
                        println!("{:?}", e);
                        panic!("3"); // 不该运行到这里
                    }
                    e.type_args = None;
                }
            }
        }
    }
}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually
/// if plugin need to handle low-level ptr directly via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8, ast_ptr_len: i32,
///     unresolved_mark: u32, should_enable_comments_proxy: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */`
///
/// This requires manual handling of serialization / deserialization from ptrs.
/// Refer swc_plugin_macro to see how does it work internally.
#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    println!("!!!{:?}", program);
    program.fold_with(&mut as_folder(TransformVisitor))
}

// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
test!(
    Typescript(Default::default()),
    |_| as_folder(TransformVisitor),
    boo,
    // Input codes
    r#"
    import _ from "./imgui";

     _.button<"id">("cilck me!");
    "#,
    // Output codes after transformed with plugin
    r#"
    import _ from "./imgui";

     _.$.button("id", "cilck me!");
    "#
);
